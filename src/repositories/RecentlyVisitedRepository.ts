import {Sequelize} from 'sequelize/types';

import RecentlyVisited from '../models/RecentlyVisited';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class RecentlyVisitedRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[RecentlyVisited.name] as ModelStatic);
  }
}
