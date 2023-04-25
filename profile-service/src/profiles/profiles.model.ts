import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ProfileModelCreationAttr {
  name: string;
  phoneNumber: string;
  about: string;
  address: string;
  userId: number;
}

@Table({ tableName: 'profiles' })
export class ProfileModel extends Model<
  ProfileModel,
  ProfileModelCreationAttr
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  about: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: true,
  })
  userId: number;
}
