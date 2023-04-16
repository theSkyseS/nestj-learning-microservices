import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/users.model';
import { UserRolesModel } from './user-roles.model';

interface RoleCreationAttributes {
  name: string;
}

@Table({ tableName: 'roles' })
export class RoleModel extends Model<RoleModel, RoleCreationAttributes> {
  @ApiProperty({ description: "Role's ID", example: '2' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ description: "Role's Name", example: 'ADMIN' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => UserModel, () => UserRolesModel)
  users: UserModel[];
}
