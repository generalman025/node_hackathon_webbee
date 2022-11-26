import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessOwner } from './business-owner.entity';

@Entity()
export class UnavailableTimePeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column()
  name: string;

  @Column({ type: 'time', nullable: true })
  from: string;

  @Column({ type: 'time', nullable: true })
  to: string;

  @Column()
  affectToMonday: boolean;

  @Column()
  affectToTuesday: boolean;

  @Column()
  affectToWednesday: boolean;

  @Column()
  affectToThursday: boolean;

  @Column()
  affectToFriday: boolean;

  @Column()
  affectToSaturday: boolean;

  @Column()
  affectToSunday: boolean;

  @ManyToOne(() => BusinessOwner, (bu) => bu.unavailableTimePeriods)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;
}
