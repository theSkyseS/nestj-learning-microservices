import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/users.model';
import { RoleModel } from './roles.model';

@Table({ tableName: 'user-roles', createdAt: false, updatedAt: false })
export class UserRolesModel extends Model<UserRolesModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
