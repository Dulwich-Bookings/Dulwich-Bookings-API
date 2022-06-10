import {Sequelize} from 'sequelize/types';

import Resource from '../models/Resource';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class ResourceRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Resource.name] as ModelStatic);
  }
}
