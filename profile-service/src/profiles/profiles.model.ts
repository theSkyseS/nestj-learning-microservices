import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../users/users.model';

interface ProfileModelCreationAttr {
  name: string;
  phoneNumber: string;
  about: string;
  address: string;
}

@Table({ tableName: 'profiles' })
export class ProfileModel extends Model<
  ProfileModel,
  ProfileModelCreationAttr
> {
  @ApiProperty({ description: "Profile's ID", example: '23' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ description: "User's name", example: 'Ivan Ivanov' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  name: string;

  @ApiProperty({ description: "User's phone number", example: '+79991234567' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: "User's description about themselves",
    example: 'I like potato',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  about: string;

  @ApiProperty({ description: "User's address", example: 'User st., 27' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  address: string;

  @ApiProperty({ description: "ID of user's login info", example: '123' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: true,
  })
  userId: number;

  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;
}
