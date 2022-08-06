import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {Models} from '../types';

export interface ResourceMapAttributes {
  id: number;
  userId: number;
  resourceId?: number;
  subscriptionId?: number;
}

export type ResourceMapCreationAttributes = Optional<
  ResourceMapAttributes,
  'id'
>;

export class InvalidResourceMapXorError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.validateResourceMapXor);
  }
}

class ResourceMap
  extends Model<ResourceMapAttributes, ResourceMapCreationAttributes>
  implements ResourceMapAttributes
{
  public id!: number;
  public userId!: number;
  public resourceId?: number;
  public subscriptionId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'resource_map';

  public static getTableName = (): string => {
    return ResourceMap.tableName;
  };

  public validateResourceMapXor() {
    const isResourceXorSubscription = this.resourceId
      ? !this.subscriptionId
      : this.subscriptionId;
    if (!isResourceXorSubscription) {
      throw new InvalidResourceMapXorError();
    }
  }

  public static initModel(sequelize: Sequelize) {
    ResourceMap.init(
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
        tableName: ResourceMap.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (resourceMap: ResourceMap) => {
            resourceMap.validateResourceMapXor();
          },
          beforeUpdate: async (resourceMap: ResourceMap) => {
            resourceMap.validateResourceMapXor();
          },
          beforeBulkCreate: async (resourceMaps: ResourceMap[]) => {
            // console.log(resourceMaps);
            for (const resourceMap of resourceMaps) {
              resourceMap.validateResourceMapXor();
            }
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    ResourceMap.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    ResourceMap.belongsTo(models.Resource, {
      foreignKey: 'resourceId',
    });
    ResourceMap.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId',
    });
  }
}

export default ResourceMap;
