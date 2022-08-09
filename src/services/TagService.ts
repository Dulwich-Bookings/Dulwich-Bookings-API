import {TagAttributes, TagCreationAttributes} from '../models/Tag';
import TagRepository from '../repositories/TagRepository';

export default class TagService {
  private tagRepository: TagRepository;

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository;
  }

  async getAllTags(schoolId: number) {
    return this.tagRepository.getWithFilters({schoolId});
  }

  async getOneTagById(id: number) {
    return await this.tagRepository.getWithFilters({id});
  }

  async createOneTag(tag: TagCreationAttributes) {
    return this.tagRepository.createOne(tag);
  }

  async updateOneTagById(id: number, attrs: TagAttributes) {
    return this.tagRepository.updateOne(attrs, {id});
  }

  async deleteOneTagById(id: number) {
    return this.tagRepository.deleteOne({id});
  }
}
