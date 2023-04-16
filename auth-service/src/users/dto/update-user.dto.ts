import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: "User's email", example: 'example@mail.com' })
  readonly email?: string;
  @ApiProperty({ description: "User's password", example: '1213452' })
  readonly password?: string;
}
