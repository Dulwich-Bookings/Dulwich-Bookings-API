import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';
import {Role} from './User';
import userFriendlyMessages from '../consts/userFriendlyMessages';

export interface SubscriptionAttributes {
  id: number;
  name: string;
  description: string;
  link?: string;
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

export class InvalidLinkError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.invalidLink);
  }
}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public link?: string;
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

  public isValidLink() {
    // Regex to check if link is valid
    const isLink = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm
    );
    if (this.link && !isLink.test(this.link)) {
      throw new InvalidLinkError();
    }
  }

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
        link: {
          type: DataTypes.STRING(500),
          allowNull: true,
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
            const {expiry, link} = subscription;
            if (expiry) validateUTCString(expiry);
            if (link) subscription.isValidLink();
          },
          beforeUpdate: async (subscription: Subscription) => {
            const {expiry, link} = subscription;
            if (expiry) validateUTCString(expiry);
            if (link) subscription.isValidLink();
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    Subscription.belongsTo(models.School, {
      foreignKey: 'schoolId',
    });
    Subscription.hasMany(models.Bookmark, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'subscriptionId',
        allowNull: false,
      },
    });
    Subscription.hasMany(models.RecentlyVisited, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'subscriptionId',
        allowNull: false,
      },
    });
    Subscription.hasMany(models.TagMap, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'tagId',
        allowNull: false,
      },
    });
    Subscription.hasMany(models.ResourceMap, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'subscriptionId',
        allowNull: false,
      },
    });
  }
}

export default Subscription;
