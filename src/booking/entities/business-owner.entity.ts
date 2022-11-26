import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { ConfigParameter } from './config-parameter.entity';
import { EventType } from './event-type.entity';
import { TimeSlot } from './time-slot.entity';
import { UnavailableDate } from './unavailable-date.entity';
import { UnavailableTimePeriod } from './unavailable-time-period.entity';

@Entity()
export class BusinessOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.businessOwner)
  timeSlots: TimeSlot[];

  @OneToMany(() => EventType, (eventType) => eventType.businessOwner)
  eventTypes: EventType[];

  @OneToMany(
    () => UnavailableTimePeriod,
    (unavailableTimePeriod) => unavailableTimePeriod.businessOwner,
  )
  unavailableTimePeriods: UnavailableTimePeriod[];

  @OneToMany(
    () => UnavailableDate,
    (unavailableDate) => unavailableDate.businessOwner,
  )
  unavailableDates: UnavailableDate[];

  @OneToMany(
    () => ConfigParameter,
    (configParameter) => configParameter.businessOwner,
  )
  configParameters: ConfigParameter[];

  @OneToMany(() => Booking, (booking) => booking.businessOwner)
  bookings: Booking[];
}
