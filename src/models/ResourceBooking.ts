import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';

export type BookingState = 'Approved' | 'Pending';
export type BookingType = 'Booking' | 'Lesson';

export interface ResourceBookingAttributes {
  id: number;
  link?: string;
  userId: number;
  resourceId: number;
  description?: string;
  bookingState: BookingState;
  bookingType: BookingType;
}

export type ResourceBookingCreationAttributes = Optional<
  ResourceBookingAttributes,
  'id'
>;

class ResourceBooking
  extends Model<ResourceBookingAttributes, ResourceBookingCreationAttributes>
  implements ResourceBookingAttributes
{
  public id!: number;
  public link?: string;
  public userId!: number;
  public resourceId!: number;
  public description?: string;
  public bookingState!: BookingState;
  public bookingType!: BookingType;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'resource_bookings';

  public static getTableName = (): string => {
    return ResourceBooking.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    ResourceBooking.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        link: {
          type: new DataTypes.STRING(128),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        resourceId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        description: {
          type: new DataTypes.STRING(500),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
        bookingState: {
          type: DataTypes.ARRAY(DataTypes.STRING(10)),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        bookingType: {
          type: DataTypes.ARRAY(DataTypes.STRING(10)),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: ResourceBooking.getTableName()!,
        sequelize,
      }
    );
  }

  public static associate(models: Models) {
    ResourceBooking.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    ResourceBooking.belongsTo(models.Resource, {
      foreignKey: 'resourceId',
    });
    ResourceBooking.hasMany(models.ResourceBookingEvent, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'resourceBookingId',
        allowNull: false,
      },
    });
  }
}

export default ResourceBooking;
