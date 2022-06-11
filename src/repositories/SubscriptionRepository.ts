import {Sequelize} from 'sequelize/types';

import Subscription from '../models/Subscription';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class SubscriptionRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Subscription.name] as ModelStatic);
  }
}
