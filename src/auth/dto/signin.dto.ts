import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter the valid email address' })
  @IsNotEmpty({ message: 'email is not provided' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  public email: string;
}
