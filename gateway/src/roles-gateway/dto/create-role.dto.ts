import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ description: "Role's Name", example: 'ADMIN' })
  readonly name: string;
}
