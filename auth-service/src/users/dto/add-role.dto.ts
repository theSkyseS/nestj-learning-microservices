import { ApiProperty } from '@nestjs/swagger';

export class AddRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'ADMIN',
  })
  role: string;

  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  userId: number;
}
