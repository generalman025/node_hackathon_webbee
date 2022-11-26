import { IsNumber } from 'class-validator';
export class CreateBookingDto {
  @IsNumber()
  public buId: number;
  public date: string;
  public time: string;
  public contacts: Contact[];
}

class Contact {
  public email: string;
  public firstname: string;
  public lastname: string;
}
