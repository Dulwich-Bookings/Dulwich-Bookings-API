import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Role} from './User';

export interface SubscriptionAttributes {
  id: number;
  name: string;
  description: string;
  accessRights: Role[];
  credentials: string;
  expiry?: Date;
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
  public expiry?: Date;
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
          type: DataTypes.DATE,
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
      }
    );
  }
}

export default Subscription;
