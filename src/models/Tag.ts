import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import userFriendlyMessages from '../consts/userFriendlyMessages';

export interface TagAttributes {
  id: number;
  name: string;
  colour: string;
}

export class InvalidColourError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.invalidColour);
  }
}

export type TagCreationAttributes = Optional<TagAttributes, 'id'>;

class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  public id!: number;
  public name!: string;
  public colour!: string;
  public static tableName = 'tag';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static getTableName = (): string => {
    return Tag.tableName;
  };

  public isColourValid = () => {
    // regex expression to allow valid hex colour codes
    const isHexColorCode = new RegExp('^#([A-Fa-f0-9]{6})$');
    if (!isHexColorCode.test(this.colour)) {
      throw new InvalidColourError();
    }
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
        colour: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: Tag.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (tag: Tag) => {
            tag.isColourValid();
          },
          beforeUpdate: async (tag: Tag) => {
            tag.isColourValid();
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    Tag.hasMany(models.TagMap, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'tagId',
        allowNull: false,
      },
    });
  }
}

export default Tag;
