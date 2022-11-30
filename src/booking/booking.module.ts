import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigParameter } from './entities/config-parameter.entity';
import { UnavailableDate } from './entities/unavailable-date.entity';
import { UnavailableTimePeriod } from './entities/unavailable-time-period.entity';
import { BusinessOwner } from './entities/business-owner.entity';
import { Booking } from './entities/booking.entity';
import { BookingTimeSlot } from './entities/booking-time-slot.entity';
import { TimeSlot } from './entities/time-slot.entity';

export const bookingModuleConfig = {
  imports: [
    TypeOrmModule.forFeature([
      BusinessOwner,
      TimeSlot,
      UnavailableTimePeriod,
      UnavailableDate,
      ConfigParameter,
      Booking,
      BookingTimeSlot,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
};

@Module(bookingModuleConfig)
export class BookingModule {}
