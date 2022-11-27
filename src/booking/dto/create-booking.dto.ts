import {
  IsInt,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsDefined,
  IsDateString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsInt()
  public buId: number;

  @IsDefined()
  @IsDateString()
  @Matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
  public date: string;

  @IsDefined()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  public time: string;

  @ValidateNested()
  @Type(() => Contact)
  public contacts: Contact[];
}

class Contact {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  public firstname: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  public lastname: string;
}
