import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { TimeSlot } from './time-slot.entity';

@Entity()
export class BookingTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @Column()
  timeSlotId: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingTimeSlots)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.bookingTimeSlots)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot: TimeSlot;
}
