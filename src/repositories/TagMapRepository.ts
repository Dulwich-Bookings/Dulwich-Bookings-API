import {Sequelize} from 'sequelize/types';

import TagMap from '../models/TagMap';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class TagMapRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[TagMap.name] as ModelStatic);
  }
}
