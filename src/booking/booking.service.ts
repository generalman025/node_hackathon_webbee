import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingTimeSlot } from './entities/booking-time-slot.entity';
import { Booking } from './entities/booking.entity';
import { BusinessOwner } from './entities/business-owner.entity';
import { ConfigParameter } from './entities/config-parameter.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { UnavailableDate } from './entities/unavailable-date.entity';
import { UnavailableTimePeriod } from './entities/unavailable-time-period.entity';
import * as dayjs from 'dayjs';
import { addMinuteToTimeString, convertTimeStringToMinute } from './utils/misc';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BusinessOwner)
    private businessOwnerRepository: Repository<BusinessOwner>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(UnavailableTimePeriod)
    private unavailableTimePeriodRepository: Repository<UnavailableTimePeriod>,
    @InjectRepository(UnavailableDate)
    private unavailableDateRepository: Repository<UnavailableDate>,
    @InjectRepository(ConfigParameter)
    private configParameterRepository: Repository<ConfigParameter>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingTimeSlot)
    private bookingTimeSlotRepository: Repository<BookingTimeSlot>,
  ) {}

  public async create(createBookingDto: CreateBookingDto) {
    const currentDate = dayjs();
    const currentDateString = currentDate.format('YYYY-MM-DD');
    const currentTimeString = currentDate.format('HH:mm');
    if (
      currentDateString > createBookingDto.date ||
      (currentDateString === createBookingDto.date &&
        currentTimeString > createBookingDto.time)
    ) {
      throw new BadRequestException('Date/Time was in the past');
    }

    if (!(await this.businessOwnerExist(createBookingDto.buId))) {
      throw new NotFoundException('Business Owner was Not Found');
    }

    if (createBookingDto.contacts.length === 0) {
      throw new BadRequestException('No Contact was found');
    }

    // Generate / Check for Time Slot
    await this.generateTimeSlot(createBookingDto.date, createBookingDto.buId);

    const configParameter = await this.getConfigParameters(
      createBookingDto.date,
      createBookingDto.buId,
    );
    if (configParameter === null) {
      throw new NotFoundException('Configuration was Not Found');
    }

    if (
      dayjs(createBookingDto.date).diff(currentDate, 'day') >=
      configParameter.bookingDuration
    ) {
      throw new BadRequestException('Booking Duration is reach the limit');
    }

    const timeSlot = await this.getTimeSlot(
      createBookingDto.buId,
      createBookingDto.date,
      createBookingDto.time,
    );
    if (timeSlot === null) {
      throw new NotFoundException('Time Slot does not exist');
    }

    const currentBookingCount = await this.getCurrentBookingCount(timeSlot);
    const totalBookingCount =
      currentBookingCount + createBookingDto.contacts.length;
    if (totalBookingCount > configParameter.maxClientsPerSlot) {
      throw new ConflictException('Exceed Quota');
    }

    await this.createBookingTransaction(
      createBookingDto.buId,
      createBookingDto.contacts,
      totalBookingCount,
      configParameter.maxClientsPerSlot,
      timeSlot,
    );
  }

  public async findAll() {
    const currentDate = dayjs();
    const currentDateString = currentDate.format('YYYY-MM-DD');
    const currentTimeString = currentDate.format('HH:mm');
    const maxBookingDuration = 7;

    // Generate time slots
    const bus = await this.businessOwnerRepository.find();
    for (let index = 0; index < bus.length; index++) {
      let runningDate = currentDate;
      const configParameter = await this.getConfigParameters(
        currentDateString,
        bus[index].id,
      );
      if (configParameter === null) continue;

      while (
        runningDate.format('YYYY-MM-DD') <= configParameter.activeTo &&
        runningDate.diff(currentDate, 'day') <= maxBookingDuration
      ) {
        await this.generateTimeSlot(
          runningDate.format('YYYY-MM-DD'),
          bus[index].id,
        );
        runningDate = runningDate.add(1, 'day');
      }
    }

    // Update current date slots
    const currentDateTimeSlots = await this.timeSlotRepository.find({
      where: [
        {
          isAvailable: true,
          date: currentDateString,
        },
      ],
    });
    currentDateTimeSlots.forEach((cdt) => {
      if (cdt.from < currentTimeString) {
        cdt.isAvailable = false;
      }
    });
    await this.timeSlotRepository.save(currentDateTimeSlots);

    // Get all available slots
    return await this.timeSlotRepository.find({
      where: [
        {
          isAvailable: true,
          date: MoreThanOrEqual(currentDateString),
        },
      ],
      order: {
        buId: 'ASC',
        date: 'ASC',
        from: 'ASC',
      },
    });
  }

  private async businessOwnerExist(buId) {
    return (
      (await this.businessOwnerRepository.count({
        where: [
          {
            id: buId,
          },
        ],
      })) > 0
    );
  }

  private async getTimeSlot(buId, date, time) {
    return await this.timeSlotRepository.findOne({
      where: [
        {
          buId,
          date,
          from: time,
        },
      ],
    });
  }

  private async getCurrentBookingCount(timeSlot) {
    return await this.bookingTimeSlotRepository.count({
      where: [
        {
          timeSlotId: timeSlot.id,
        },
      ],
    });
  }

  private async createBookingTransaction(
    buId,
    contacts,
    totalBookingCount,
    maxClientsPerSlot,
    timeSlot,
  ) {
    for (let index = 0; index < contacts.length; index++) {
      const booking = await this.bookingRepository.insert({
        buId: buId,
        clientEmail: contacts[index].email,
        clientFirstname: contacts[index].firstname,
        clientLastname: contacts[index].lastname,
      });
      await this.bookingTimeSlotRepository.insert({
        bookingId: +booking.identifiers[0].id,
        timeSlotId: timeSlot.id,
      });
    }

    if (totalBookingCount == maxClientsPerSlot) {
      timeSlot.isAvailable = false;
      await this.timeSlotRepository.save(timeSlot);
    }
  }

  private async generateTimeSlot(targetDate, buId) {
    if (await this.isUnavailableDate(targetDate, buId)) {
      const timeSlots = await this.timeSlotRepository.find({
        where: [
          {
            date: targetDate,
          },
        ],
      });
      for (let index = 0; index < (await timeSlots).length; index++) {
        const timeSlot = timeSlots[index];
        timeSlot.isAvailable = false;
        await this.timeSlotRepository.save(timeSlot);
      }
      return; // It's unavailable day
    }

    const configParameter = await this.getConfigParameters(targetDate, buId);
    if (configParameter === null) {
      return; // Given date isn't fall in active range
    }

    if (await this.timeSlotExists(buId, targetDate)) {
      // Update the Status of Slot
      const timeSlots = await this.timeSlotRepository.find({
        where: [
          {
            date: targetDate,
          },
        ],
      });
      for (let index = 0; index < (await timeSlots).length; index++) {
        const timeSlot = timeSlots[index];
        const bookingTimeSlots = await this.bookingTimeSlotRepository.find({
          where: [
            {
              timeSlotId: timeSlot.id,
            },
          ],
        });
        if (bookingTimeSlots.length < configParameter.maxClientsPerSlot) {
          timeSlot.isAvailable = true;
        } else {
          timeSlot.isAvailable = false;
        }
        await this.timeSlotRepository.save(timeSlot);
      }
      return; // Already generated time slots
    }

    // Collect all unavailable periods
    const totalUnavailablePeriod = [];

    const dayOfWeek = dayjs(targetDate, 'YYYY-MM-DD').day();
    const [from, to] = this.getInactivePeriod(configParameter, dayOfWeek);
    if (from === null && to === null) {
      return; //  'Day Off'
    }
    totalUnavailablePeriod.push(['00:00', from]);
    totalUnavailablePeriod.push([to, '24:00']);

    const unavailableDate = await this.getUnavailableDateTime(targetDate, buId);
    unavailableDate.forEach((ud) => {
      totalUnavailablePeriod.push([ud.from, ud.to]);
    });

    const unavailableTimePeriods = await this.getUnavailableTimePeriod(
      dayOfWeek,
      buId,
    );
    unavailableTimePeriods.forEach((utp) => totalUnavailablePeriod.push(utp));

    this.sortAndMergeUnavailableTimePeriod(totalUnavailablePeriod);

    // Get all available periods
    const availablePeriod = this.getAllAvailablePeriod(totalUnavailablePeriod);

    // Generate all available slots
    await this.generateAllAvailableTimeSlot(
      availablePeriod,
      configParameter,
      targetDate,
      buId,
    );
  }

  private async timeSlotExists(buId, targetDate) {
    return await this.timeSlotRepository
      .find({
        where: [
          {
            buId: buId,
            date: targetDate,
          },
        ],
      })
      .then((timeSlot) => timeSlot.length > 0);
  }

  private async getConfigParameters(targetDate, buId) {
    const configParameters = await this.configParameterRepository.find({
      where: [
        {
          buId: buId,
          activeFrom: LessThanOrEqual(targetDate),
          activeTo: MoreThanOrEqual(targetDate),
        },
      ],
    });
    return configParameters.length === 0 ? null : configParameters[0];
  }

  private async isUnavailableDate(targetDate, buId) {
    return await this.unavailableDateRepository
      .find({
        where: [
          {
            buId: buId,
            isAllDay: true,
            date: targetDate,
          },
        ],
      })
      .then((unavailableDate) => unavailableDate.length > 0);
  }

  private getInactivePeriod(configParameter, dayOfWeek) {
    let from = '',
      to = '';
    switch (dayOfWeek) {
      case 0:
        from = configParameter.sundayOpenFrom;
        to = configParameter.sundayOpenTo;
        break;
      case 1:
        from = configParameter.mondayOpenFrom;
        to = configParameter.mondayOpenTo;
        break;
      case 2:
        from = configParameter.tuesdayOpenFrom;
        to = configParameter.tuesdayOpenTo;
        break;
      case 3:
        from = configParameter.wednesdayOpenFrom;
        to = configParameter.wednesdayOpenTo;
        break;
      case 4:
        from = configParameter.thursdayOpenFrom;
        to = configParameter.thursdayOpenTo;
        break;
      case 5:
        from = configParameter.fridayOpenFrom;
        to = configParameter.fridayOpenTo;
        break;
      case 6:
        from = configParameter.saturdayOpenFrom;
        to = configParameter.saturdayOpenTo;
        break;
    }
    return [from, to];
  }

  private async getUnavailableDateTime(targetDate, buId) {
    return await this.unavailableDateRepository.find({
      where: [
        {
          buId: buId,
          isAllDay: false,
          date: targetDate,
        },
      ],
    });
  }

  private async getUnavailableTimePeriod(dayOfWeek, buId) {
    const unavailableTimePeriods =
      await this.unavailableTimePeriodRepository.find({
        where: [
          {
            buId: buId,
          },
        ],
      });
    const result = [];
    unavailableTimePeriods.forEach((utp) => {
      switch (dayOfWeek) {
        case 0:
          if (utp.affectToSunday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 1:
          if (utp.affectToMonday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 2:
          if (utp.affectToTuesday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 3:
          if (utp.affectToWednesday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 4:
          if (utp.affectToThursday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 5:
          if (utp.affectToFriday) {
            result.push([utp.from, utp.to]);
          }
          break;
        case 6:
          if (utp.affectToSaturday) {
            result.push([utp.from, utp.to]);
          }
          break;
      }
    });
    return result;
  }

  private sortAndMergeUnavailableTimePeriod(totalUnavailablePeriod) {
    totalUnavailablePeriod.sort((a, b) => {
      if (a[0] > b[0]) return 1;
      else if (a[0] < b[0]) return -1;
      else return 0;
    });
    let pointer = 1;
    while (pointer < totalUnavailablePeriod.length) {
      if (
        totalUnavailablePeriod[pointer - 1][1] >
        totalUnavailablePeriod[pointer][0]
      ) {
        totalUnavailablePeriod[pointer - 1][1] =
          totalUnavailablePeriod[pointer][1];
        totalUnavailablePeriod.splice(pointer, 1);
      } else {
        pointer++;
      }
    }
  }

  private getAllAvailablePeriod(totalUnavailablePeriod) {
    let pointer = 1;
    const availablePeriod = [];
    while (pointer < totalUnavailablePeriod.length) {
      availablePeriod.push([
        totalUnavailablePeriod[pointer - 1][1],
        totalUnavailablePeriod[pointer][0],
        convertTimeStringToMinute(totalUnavailablePeriod[pointer][0]) -
          convertTimeStringToMinute(totalUnavailablePeriod[pointer - 1][1]),
      ]);
      pointer++;
    }
    return availablePeriod;
  }

  private async generateAllAvailableTimeSlot(
    availablePeriod,
    configParameter,
    targetDate,
    buId,
  ) {
    const minutesPerSlot =
      configParameter.minutesPerSlot + configParameter.breakBetweenSlotInMinute;
    await availablePeriod.forEach(async (ap) => {
      let [startFrom, , totalMinutes] = ap;
      while (totalMinutes >= minutesPerSlot) {
        const endTime = addMinuteToTimeString(startFrom, minutesPerSlot);
        const newTimeSlot = this.timeSlotRepository.create({
          buId,
          date: targetDate,
          from: startFrom,
          to: endTime,
          isAvailable: true,
        });
        await this.timeSlotRepository.insert(newTimeSlot);

        startFrom = endTime;
        totalMinutes -= minutesPerSlot;
      }
    });
  }
}
