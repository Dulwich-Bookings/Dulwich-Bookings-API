import TagMap, {
  TagMapAttributes,
  TagMapCreationAttributes,
} from '../models/TagMap';
import TagMapRepository from '../repositories/TagMapRepository';

export default class TagMapService {
  private tagMapRepository: TagMapRepository;

  constructor(tagMapRepository: TagMapRepository) {
    this.tagMapRepository = tagMapRepository;
  }

  async createOneTagMap(tagMap: TagMapCreationAttributes) {
    return (await this.tagMapRepository.createOne(tagMap)) as TagMap;
  }

  async getAllTagMaps() {
    return (await this.tagMapRepository.getAll()) as TagMap[];
  }

  async getOneTagMapById(id: number) {
    return (await this.tagMapRepository.getWithFilters({id}))[0] as TagMap;
  }

  async getTagMapsByUserId(userId: number) {
    return (await this.tagMapRepository.getWithFilters({
      userId,
    })) as TagMap[];
  }

  async updateOneTagMapById(id: number, attrs: TagMapAttributes) {
    return (await this.tagMapRepository.updateOne(attrs, {
      id,
    })) as TagMap;
  }

  async deleteOneTagMapById(id: number) {
    return this.tagMapRepository.deleteOne({id});
  }
}
