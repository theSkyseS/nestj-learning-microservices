import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: "User's name", example: 'Ivan Ivanov' })
  readonly name?: string;
  @ApiProperty({ description: "User's phone number", example: '1213452' })
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
