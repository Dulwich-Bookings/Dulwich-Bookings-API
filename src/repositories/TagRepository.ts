import {Sequelize} from 'sequelize/types';

import Tag from '../models/Tag';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class TagRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Tag.name] as ModelStatic);
  }
}
