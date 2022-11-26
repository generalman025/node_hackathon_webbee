import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessOwner } from './business-owner.entity';

@Entity()
export class UnavailableDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  from: string;

  @Column({ type: 'time', nullable: true })
  to: string;

  @Column()
  isAllDay: boolean;

  @ManyToOne(() => BusinessOwner, (bu) => bu.unavailableDates)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;
}
