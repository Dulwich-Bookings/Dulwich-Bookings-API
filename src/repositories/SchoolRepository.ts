import {Sequelize} from 'sequelize/types';

import School from '../models/School';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class SchoolRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[School.name] as ModelStatic);
  }
}
