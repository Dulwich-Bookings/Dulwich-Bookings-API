import TagMap, {
  TagMapAttributes,
  TagMapCreationAttributes,
} from '../models/TagMap';
import TagMapRepository from '../repositories/TagMapRepository';
import {DeleteOptions} from './UserService';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class TagMapService {
  private tagMapRepository: TagMapRepository;

  constructor(tagMapRepository: TagMapRepository) {
    this.tagMapRepository = tagMapRepository;
  }

  async createOneTagMap(
    tagMap: TagMapCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.tagMapRepository.createOne(tagMap, options)) as TagMap;
  }

  async getAllTagMaps() {
    return (await this.tagMapRepository.getAll()) as TagMap[];
  }

  async bulkCreateTagMap(
    tagMaps: TagMapCreationAttributes[],
    options?: TransactionOptions
  ) {
    return (await this.tagMapRepository.bulkCreate(
      tagMaps,
      options
    )) as TagMap[];
  }

  async bulkDeleteTagMap(tagMaps: DeleteOptions, options?: TransactionOptions) {
    return await this.tagMapRepository.bulkDelete(tagMaps, options);
  }

  async getOneTagMapById(id: number) {
    return (await this.tagMapRepository.getWithFilters({id}))[0] as TagMap;
  }

  async updateOneTagMapById(
    id: number,
    attrs: TagMapAttributes,
    options?: TransactionOptions
  ) {
    return (await this.tagMapRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as TagMap;
  }

  async deleteOneTagMapById(id: number, options?: TransactionOptions) {
    return this.tagMapRepository.deleteOne({id}, options);
  }
}
