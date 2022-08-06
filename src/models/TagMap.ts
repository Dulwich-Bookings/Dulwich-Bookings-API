import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {Models} from '../types';

export interface TagMapAttributes {
  id: number;
  tagId: number;
  resourceId?: number;
  subscriptionId?: number;
}

export type TagMapCreationAttributes = Optional<TagMapAttributes, 'id'>;

export class InvalidTagMapXorError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.validateTagMapXor);
  }
}

class TagMap
  extends Model<TagMapAttributes, TagMapCreationAttributes>
  implements TagMapAttributes
{
  public id!: number;
  public tagId!: number;
  public resourceId?: number;
  public subscriptionId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'tag_map';

  public static getTableName = (): string => {
    return TagMap.tableName;
  };

  public validateTagMapXor() {
    const isResourceXorSubscription = this.resourceId
      ? !this.subscriptionId
      : this.subscriptionId;
    if (!isResourceXorSubscription) {
      throw new InvalidTagMapXorError();
    }
  }

  public static initModel(sequelize: Sequelize) {
    TagMap.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        tagId: {
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
        tableName: TagMap.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (tagMap: TagMap) => {
            tagMap.validateTagMapXor();
          },
          beforeUpdate: async (tagMap: TagMap) => {
            tagMap.validateTagMapXor();
          },
          beforeBulkCreate: async (tagMaps: TagMap[]) => {
            for (const tagMap of tagMaps) {
              tagMap.validateTagMapXor();
            }
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    TagMap.belongsTo(models.Tag, {
      foreignKey: 'tagId',
    });
    TagMap.belongsTo(models.Resource, {
      foreignKey: 'resourceId',
    });
    TagMap.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId',
    });
  }
}

export default TagMap;
