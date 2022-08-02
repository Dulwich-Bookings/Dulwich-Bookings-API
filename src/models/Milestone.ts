import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';

export interface MilestoneAttributes {
  id: number;
  schoolId: number;
  weekBeginning: string;
  week: number;
}

export type MilestoneCreationAttributes = Optional<MilestoneAttributes, 'id'>;

class Milestone
  extends Model<MilestoneAttributes, MilestoneCreationAttributes>
  implements MilestoneAttributes
{
  public id!: number;
  public schoolId!: number;
  public weekBeginning!: string;
  public week!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'milestones';

  public static getTableName = (): string => {
    return Milestone.tableName;
  };

  public static initModel(sequelize: Sequelize) {
    Milestone.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        schoolId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        weekBeginning: {
          type: DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        week: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      },
      {
        tableName: Milestone.getTableName()!,
        sequelize,
        hooks: {
          beforeCreate: async (milestone: Milestone) => {
            console.log(milestone.weekBeginning);
            validateUTCString(milestone.weekBeginning);
          },
          beforeUpdate: async (milestone: Milestone) => {
            validateUTCString(milestone.weekBeginning);
          },
          beforeBulkCreate: async (milestones: Milestone[]) => {
            for (const milestone of milestones) {
              validateUTCString(milestone.weekBeginning);
            }
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    Milestone.belongsTo(models.School, {
      foreignKey: 'schoolId',
    });
  }
}

export default Milestone;
