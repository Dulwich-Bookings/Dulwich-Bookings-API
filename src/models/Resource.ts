import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Role} from './User';

export interface ResourceAttributes {
  id: number;
  name: string;
  description: string;
  accessRights: Role[];
  bookingRights: Role[];
  inAdvance: number;
  isBookingDescriptionOptional: boolean;
  schoolId: number;
}

export type ResourceCreationAttributes = Optional<ResourceAttributes, 'id'>;

class Resource
  extends Model<ResourceAttributes, ResourceCreationAttributes>
  implements ResourceAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public accessRights!: Role[];
  public bookingRights!: Role[];
  public inAdvance!: number;
  public isBookingDescriptionOptional!: boolean;
  public schoolId!: number; // foreign key

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'resources';

  public static getTableName = (): string => {
    return Resource.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Resource.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: DataTypes.STRING(500),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        accessRights: {
          type: DataTypes.ARRAY(DataTypes.STRING(10)),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        bookingRights: {
          type: DataTypes.ARRAY(DataTypes.STRING(10)),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        inAdvance: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        isBookingDescriptionOptional: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        schoolId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: Resource.getTableName()!,
        sequelize,
      }
    );
  }
}

export default Resource;