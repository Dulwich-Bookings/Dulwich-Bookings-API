import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {Models} from '../types';

export interface RecentlyVisitedAttributes {
  id: number;
  userId: number;
  resourceId?: number;
  subscriptionId?: number;
}

export type RecentlyVisitedCreationAttributes = Optional<
  RecentlyVisitedAttributes,
  'id'
>;

export class InvalidRecentlyVisitedXorError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.validateRecentlyVisitedXor);
  }
}

class RecentlyVisited
  extends Model<RecentlyVisitedAttributes, RecentlyVisitedCreationAttributes>
  implements RecentlyVisitedAttributes
{
  public id!: number;
  public userId!: number;
  public resourceId?: number;
  public subscriptionId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'recently_visited';

  public static getTableName = (): string => {
    return RecentlyVisited.tableName;
  };

  public validateRecentlyVisitedXor() {
    const isResourceIdDefined = this.resourceId !== null;
    const isSubscriptionIdDefined = this.subscriptionId !== null;
    const isResourceXorSubscription = isResourceIdDefined
      ? !isSubscriptionIdDefined
      : isSubscriptionIdDefined;
    if (!isResourceXorSubscription) {
      throw new InvalidRecentlyVisitedXorError();
    }
  }

  public static initModel(sequelize: Sequelize) {
    RecentlyVisited.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
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
          allowNull: true,
        },
        subscriptionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        tableName: RecentlyVisited.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (recentlyVisited: RecentlyVisited) => {
            recentlyVisited.validateRecentlyVisitedXor();
          },
          beforeUpdate: async (recentlyVisited: RecentlyVisited) => {
            recentlyVisited.validateRecentlyVisitedXor();
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    RecentlyVisited.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    RecentlyVisited.belongsTo(models.Resource, {
      foreignKey: 'resourceId',
    });
    RecentlyVisited.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId',
    });
  }
}

export default RecentlyVisited;
