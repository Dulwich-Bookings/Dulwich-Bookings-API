import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {Models} from '../types';

export interface BookmarkAttributes {
  id: number;
  userId: number;
  resourceId?: number;
  subscriptionId?: number;
}

export type BookmarkCreationAttributes = Optional<BookmarkAttributes, 'id'>;

export class InvalidBookmarkXorError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.validateBookmarkXor);
  }
}

class Bookmark
  extends Model<BookmarkAttributes, BookmarkCreationAttributes>
  implements BookmarkAttributes
{
  public id!: number;
  public userId!: number;
  public resourceId?: number;
  public subscriptionId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'bookmarks';

  public static getTableName = (): string => {
    return Bookmark.tableName;
  };

  public validateBookmarkXor() {
    const isResourceIdDefined = this.resourceId !== null;
    const isSubscriptionIdDefined = this.subscriptionId !== null;
    const isResourceXorSubscription = isResourceIdDefined
      ? !isSubscriptionIdDefined
      : isSubscriptionIdDefined;
    if (!isResourceXorSubscription) {
      throw new InvalidBookmarkXorError();
    }
  }

  public static initModel(sequelize: Sequelize) {
    Bookmark.init(
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
        tableName: Bookmark.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (bookmark: Bookmark) => {
            bookmark.validateBookmarkXor();
          },
          beforeUpdate: async (bookmark: Bookmark) => {
            bookmark.validateBookmarkXor();
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Bookmark.belongsTo(models.Resource, {
      foreignKey: 'resourceId',
    });
    Bookmark.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId',
    });
  }
}

export default Bookmark;
