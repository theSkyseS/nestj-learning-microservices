import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "User's name", example: 'Ivan Ivanov' })
  readonly name?: string;

  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Phone number is not valid' })
  @ApiProperty({ description: "User's phone number", example: '+79991234567' })
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "User's about section",
    example: 'I hate tomatoes',
  })
  readonly about?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "User's address",
    example: 'User st., 25',
  })
  readonly address?: string;
}
