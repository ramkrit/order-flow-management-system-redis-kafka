import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsMobilePhone('en-IN')
  mobile: string;

  @ApiProperty()
  @Length(4, 6)
  otp: string;
}
