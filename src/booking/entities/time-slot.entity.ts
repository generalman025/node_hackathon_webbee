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
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @ManyToOne(() => BusinessOwner, (bu) => bu.timeSlots)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;

  @OneToMany(
    () => BookingTimeSlot,
    (bookingTimeSlot) => bookingTimeSlot.timeSlot,
  )
  bookingTimeSlots: BookingTimeSlot[];
}
