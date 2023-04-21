import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: "User's login", example: 'example@mail.com' })
  readonly login: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @ApiProperty({ description: "User's password", example: '1213452' })
  readonly password: string;
}
