import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter the valid email address' })
  @IsNotEmpty({ message: 'email is not provided' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  public email: string;

  @IsNumber()
  @IsNotEmpty({ message: 'role id is not provided' })
  public role_id: number;
}
