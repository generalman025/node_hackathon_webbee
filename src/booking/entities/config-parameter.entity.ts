import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessOwner } from './business-owner.entity';

@Entity()
export class ConfigParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buId: number;

  @Column()
  maxClientsPerSlot: number;

  @Column()
  minutesPerSlot: number;

  @Column()
  breakBetweenSlotInMinute: number;

  @Column({ type: 'time' })
  mondayOpenFrom: string;

  @Column({ type: 'time' })
  mondayOpenTo: string;

  @Column({ type: 'time' })
  tuesdayOpenFrom: string;

  @Column({ type: 'time' })
  tuesdayOpenTo: string;

  @Column({ type: 'time' })
  wednesdayOpenFrom: string;

  @Column({ type: 'time' })
  wednesdayOpenTo: string;

  @Column({ type: 'time' })
  thursdayOpenFrom: string;

  @Column({ type: 'time' })
  thursdayOpenTo: string;

  @Column({ type: 'time' })
  fridayOpenFrom: string;

  @Column({ type: 'time' })
  fridayOpenTo: string;

  @Column({ type: 'time' })
  saturdayOpenFrom: string;

  @Column({ type: 'time' })
  saturdayOpenTo: string;

  @Column({ type: 'time' })
  sundayOpenFrom: string;

  @Column({ type: 'time' })
  sundayOpenTo: string;

  @Column({ type: 'date' })
  activeFrom: string;

  @Column({ type: 'date' })
  activeTo: string;

  @Column()
  bookingDuration: number;

  @ManyToOne(() => BusinessOwner, (bu) => bu.configParameters)
  @JoinColumn({ name: 'buId' })
  businessOwner: BusinessOwner;
}
