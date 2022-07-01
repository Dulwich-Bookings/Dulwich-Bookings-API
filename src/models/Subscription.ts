import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';
import {Role} from './User';

export interface SubscriptionAttributes {
  id: number;
  name: string;
  description: string;
  accessRights: Role[];
  credentials: string;
  expiry?: string;
  remindMe: boolean;
  schoolId: number;
}

export type SubscriptionCreationAttributes = Optional<
  SubscriptionAttributes,
  'id'
>;

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public accessRights!: Role[];
  public credentials!: string;
  public expiry?: string;
  public remindMe!: boolean;
  public schoolId!: number; // foreign key

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'subscriptions';

  public static getTableName = (): string => {
    return Subscription.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Subscription.init(
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
        credentials: {
          type: DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        expiry: {
          type: DataTypes.STRING(128),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
        remindMe: {
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
        tableName: Subscription.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (subscription: Subscription) => {
            const {expiry} = subscription;
            if (expiry) {
              validateUTCString(expiry);
            }
          },
          beforeUpdate: async (subscription: Subscription) => {
            const {expiry} = subscription;
            if (expiry) {
              validateUTCString(expiry);
            }
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    Subscription.belongsTo(models.School, {
      foreignKey: 'schoolId',
    });
  }
}

export default Subscription;
