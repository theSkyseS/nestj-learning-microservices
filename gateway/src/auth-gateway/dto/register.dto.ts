import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: "User's login", example: 'example@mail.com' })
  readonly login: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @ApiProperty({ description: "User's password", example: '1213452' })
  readonly password: string;

  @IsString()
  @ApiProperty({ description: "User's name", example: 'Ivan Ivanov' })
  readonly name: string;

  @IsPhoneNumber('RU', { message: 'Phone number is not valid' })
  @ApiProperty({ description: "User's phone number", example: '+79991234567' })
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "User's about section",
    example: 'I hate tomatoes',
  })
  readonly about?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "User's address",
    example: 'User st., 25',
  })
  readonly address?: string;
}
