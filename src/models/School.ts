import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {Timezone} from '../types/timezone';

export interface SchoolAttributes {
  id: number;
  name: string;
  alternativeName?: string;
  timezone: Timezone;
}

export type SchoolCreationAttributes = Optional<SchoolAttributes, 'id'>;

class School
  extends Model<SchoolAttributes, SchoolCreationAttributes>
  implements SchoolAttributes
{
  public id!: number;
  public name!: string;
  public alternativeName?: string;
  public timezone!: Timezone;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'schools';

  public static getTableName = (): string => {
    return School.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    School.init(
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
        alternativeName: {
          type: DataTypes.STRING(128),
          allowNull: true,
          validate: {
            notEmpty: false,
          },
        },
        timezone: {
          type: DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: School.getTableName()!,
        sequelize,
      }
    );
  }

  public static associate(models: Models) {
    School.hasMany(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'schoolId',
        allowNull: false,
      },
    });
    School.hasMany(models.Resource, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'schoolId',
        allowNull: false,
      },
    });
    School.hasMany(models.Subscription, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'schoolId',
        allowNull: false,
      },
    });
    School.hasMany(models.Milestone, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'schoolId',
        allowNull: false,
      },
    });
  }
}

export default School;
