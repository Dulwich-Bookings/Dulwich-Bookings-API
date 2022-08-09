import {
  ResourceAttributes,
  ResourceCreationAttributes,
} from '../models/Resource';
import ResourceRepository from '../repositories/ResourceRepository';
import Resource from '../models/Resource';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class ResourceService {
  private resourceRepository: ResourceRepository;

  constructor(resourceRepository: ResourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async createOneResource(
    resource: ResourceCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceRepository.createOne(
      resource,
      options
    )) as Resource;
  }

  async getAllResources(schoolId: number) {
    return (await this.resourceRepository.getWithFilters({
      schoolId,
    })) as Resource[];
  }

  async getOneResourceById(id: number) {
    return (await this.resourceRepository.getWithFilters({id}))[0] as Resource;
  }

  async updateOneResourceById(
    id: number,
    attrs: ResourceAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceRepository.updateOne(
      attrs,
      {id},
      options
    )) as Resource;
  }

  async deleteOneResourceById(id: number, options?: TransactionOptions) {
    return this.resourceRepository.deleteOne({id}, options);
  }
}
