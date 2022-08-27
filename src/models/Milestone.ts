import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import moment from 'moment';
import {Models} from '../types';
import {validateUTCString} from '../utils/datetimeUtils';

export interface MilestoneAttributes {
  id: number;
  schoolId: number;
  weekBeginning: string;
  week: number;
}

export type MilestoneCreationAttributes = Optional<MilestoneAttributes, 'id'>;

/**
 * Compare function used to sort Milestones based on weekBeginning
 * @param curr current Milestone
 * @param next current Milestone to compare
 * @returns positive value, if next is before curr. Negative value,
 * if next is after curr. 0 otherwise.
 */
export function compareByWeekBeginning(
  curr: Milestone,
  next: Milestone
): number {
  const currWeekBeginning = moment.utc(curr.weekBeginning);
  const nextWeekBeginning = moment.utc(next.weekBeginning);
  return nextWeekBeginning.diff(currWeekBeginning);
}

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
