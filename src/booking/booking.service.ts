import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingTimeSlot } from './entities/booking-time-slot.entity';
import { Booking } from './entities/booking.entity';
import { BusinessOwner } from './entities/business-owner.entity';
import { ConfigParameter } from './entities/config-parameter.entity';
import { EventType } from './entities/event-type.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { UnavailableDate } from './entities/unavailable-date.entity';
import { UnavailableTimePeriod } from './entities/unavailable-time-period.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BusinessOwner)
    private businessOwnerRepository: Repository<BusinessOwner>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
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

  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  async findAll() {
    // console.log('query', await this.businessOwnerRepository.find());

    // console.log('query', await this.timeSlotRepository.find());

    // console.log('query', await this.eventTypeRepository.find());

    // console.log('query', await this.unavailableTimePeriodRepository.find());

    // console.log('query', await this.unavailableDateRepository.find());

    // console.log('query', await this.configParameterRepository.find());

    // console.log('query', await this.bookingRepository.find());

    // console.log('query', await this.bookingTimeSlotRepository.find());

    return `This action returns all booking`;
  }
}
