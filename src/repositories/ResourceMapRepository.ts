import {Sequelize} from 'sequelize/types';

import ResourceMap from '../models/ResourceMap';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class ResourceMapRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[ResourceMap.name] as ModelStatic);
  }
}
