import {Sequelize} from 'sequelize/types';

import {ResourceBookingEvent} from '../models';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class ResourceBookingEventRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[ResourceBookingEvent.name] as ModelStatic);
  }
}
