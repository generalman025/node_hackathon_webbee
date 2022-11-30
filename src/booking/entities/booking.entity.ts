import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingTimeSlot } from './booking-time-slot.entity';
import { BusinessOwner } from './business-owner.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column()
  clientEmail: string;

  @Column()
  clientFirstname: string;

  @Column()
  clientLastname: string;

  @ManyToOne(() => BusinessOwner, (bu) => bu.bookings)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;

  @OneToMany(
    () => BookingTimeSlot,
    (bookingTimeSlot) => bookingTimeSlot.booking,
  )
  bookingTimeSlots: BookingTimeSlot[];
}
