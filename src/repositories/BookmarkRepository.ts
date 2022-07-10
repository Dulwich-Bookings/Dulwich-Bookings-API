import {Sequelize} from 'sequelize/types';

import Bookmark from '../models/Bookmark';
import {ModelStatic} from '../types';
import BaseRepository from './BaseRepository';

export default class BookmarkRepository extends BaseRepository {
  constructor(db: Sequelize) {
    super(db.models[Bookmark.name] as ModelStatic);
  }
}
