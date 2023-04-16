import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/users.model';

interface RefreshModelCreationAttr {
  refreshToken: string;
  userId: number;
}

@Table({ tableName: 'refresh-tokens' })
export class RefreshModel extends Model<
  RefreshModel,
  RefreshModelCreationAttr
> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  })
  refreshToken: string;

  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;
}
