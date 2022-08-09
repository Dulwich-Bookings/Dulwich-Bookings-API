import {Sequelize} from 'sequelize/types';

import {ResourceBooking} from '../models';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class ResourceBookingRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[ResourceBooking.name] as ModelStatic);
  }
}
