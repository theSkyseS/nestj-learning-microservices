import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ description: "User's email", example: 'example@mail.com' })
  readonly email: string;
  @ApiProperty({ description: "User's password", example: '1213452' })
  readonly password: string;
  @ApiProperty({ description: "User's name", example: 'Ivan Ivanov' })
  readonly name: string;
  @ApiProperty({ description: "User's phone number", example: '+79991234567' })
  readonly phoneNumber?: string;
  @ApiProperty({
    description: "User's about section",
    example: 'I hate tomatoes',
  })
  readonly about?: string;
  @ApiProperty({
    description: "User's address",
    example: 'User st., 25',
  })
  readonly address?: string;
}
