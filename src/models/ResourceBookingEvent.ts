import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';

export interface ResourceBookingEventAttributes {
  id: number;
  resourceBookingId: number;
  startDateTime: string;
  endDateTime: string;
  RRULE?: string;
}

export type ResourceBookingEventCreationAttributes = Optional<
  ResourceBookingEventAttributes,
  'id'
>;

class ResourceBookingEvent
  extends Model<
    ResourceBookingEventAttributes,
    ResourceBookingEventCreationAttributes
  >
  implements ResourceBookingEventAttributes
{
  public id!: number;
  public resourceBookingId!: number;
  public startDateTime!: string;
  public endDateTime!: string;
  public RRULE?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'resource_booking_events';

  public static getTableName = (): string => {
    return ResourceBookingEvent.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    ResourceBookingEvent.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        resourceBookingId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
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
        RRULE: {
          type: new DataTypes.STRING(128),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
      },
      {
        tableName: ResourceBookingEvent.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (resourceBookingEvent: ResourceBookingEvent) => {
            const {startDateTime, endDateTime} = resourceBookingEvent;
            validateUTCString(startDateTime);
            validateUTCString(endDateTime);
          },
          beforeUpdate: async (resourceBookingEvent: ResourceBookingEvent) => {
            const {startDateTime, endDateTime} = resourceBookingEvent;
            validateUTCString(startDateTime);
            validateUTCString(endDateTime);
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    ResourceBookingEvent.belongsTo(models.ResourceBooking, {
      foreignKey: 'resourceBookingId',
    });
  }
}

export default ResourceBookingEvent;
