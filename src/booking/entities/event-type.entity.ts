import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { BusinessOwner } from './business-owner.entity';

@Entity()
export class EventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column()
  name: string;

  @Column()
  numberOfSlot: number;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => BusinessOwner, (bu) => bu.eventTypes)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;

  @OneToMany(() => Booking, (booking) => booking.eventType)
  bookings: Booking[];
}
