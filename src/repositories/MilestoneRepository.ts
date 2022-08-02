import {Sequelize} from 'sequelize/types';

import Milestone from '../models/Milestone';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class MilestoneRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Milestone.name] as ModelStatic);
  }
}
