import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: "User's login", example: 'example@mail.com' })
  readonly login?: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @ApiProperty({ description: "User's password", example: '1213452' })
  readonly password?: string;
}
