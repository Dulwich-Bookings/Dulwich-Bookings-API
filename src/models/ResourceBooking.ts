import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';

export type BookingState = 'Approved' | 'Pending';
export type BookingType = 'Booking' | 'Lesson';

export interface ResourceBookingAttributes {
  id: number;
  link?: string;
  userId: number;
  resourceId: number;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  bookingState: BookingState;
  bookingType: BookingType;
  RRULE?: string;
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
  public startDateTime!: string;
  public endDateTime!: string;
  public bookingState!: BookingState;
  public bookingType!: BookingType;
  public RRULE?: string;
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
        startDateTime: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        endDateTime: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
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
        RRULE: {
          type: new DataTypes.STRING(128),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
      },
      {
        tableName: ResourceBooking.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (resourceBooking: ResourceBooking) => {
            const {startDateTime, endDateTime} = resourceBooking;
            validateUTCString(startDateTime);
            validateUTCString(endDateTime);
          },
          beforeUpdate: async (resourceBooking: ResourceBooking) => {
            const {startDateTime, endDateTime} = resourceBooking;
            validateUTCString(startDateTime);
            validateUTCString(endDateTime);
          },
        },
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
  }
}

export default ResourceBooking;
