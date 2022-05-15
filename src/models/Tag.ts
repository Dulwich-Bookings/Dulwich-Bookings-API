import {Model, DataTypes, Optional, Sequelize} from 'sequelize';

export interface TagAttributes {
  id: number;
  name: string;
}

export type TagCreationAttributes = Optional<TagAttributes, 'id'>;

class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  public id!: number;
  public name!: string;
  public static tableName = 'tag';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static getTableName = (): string => {
    return this.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Tag.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.STRING(128),
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: Tag.getTableName()!,
        sequelize,
      }
    );
  }
}

export default Tag;
