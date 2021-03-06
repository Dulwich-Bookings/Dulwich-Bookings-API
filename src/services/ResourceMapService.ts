import ResourceMap, {
  ResourceMapAttributes,
  ResourceMapCreationAttributes,
} from '../models/ResourceMap';
import ResourceMapRepository from '../repositories/ResourceMapRepository';
import {DeleteOptions} from './UserService';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class ResourceMapService {
  private resourceMapRepository: ResourceMapRepository;

  constructor(resourceMapRepository: ResourceMapRepository) {
    this.resourceMapRepository = resourceMapRepository;
  }

  async createOneResourceMap(
    resourceMap: ResourceMapCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceMapRepository.createOne(
      resourceMap,
      options
    )) as ResourceMap;
  }

  async getAllResourceMaps(options?: TransactionOptions) {
    return (await this.resourceMapRepository.getAll(options)) as ResourceMap[];
  }

  async bulkCreateResourceMap(
    resourceMaps: ResourceMapCreationAttributes[],
    options?: TransactionOptions
  ) {
    return (await this.resourceMapRepository.bulkCreate(
      resourceMaps,
      options
    )) as ResourceMap[];
  }

  async bulkDeleteResourceMap(
    resourceMaps: DeleteOptions,
    options?: TransactionOptions
  ) {
    return await this.resourceMapRepository.bulkDelete(resourceMaps, options);
  }

  async getOneResourceMapById(id: number) {
    return (
      await this.resourceMapRepository.getWithFilters({id})
    )[0] as ResourceMap;
  }

  async getResourceMapsByUserId(userId: number) {
    return (await this.resourceMapRepository.getWithFilters({
      userId,
    })) as ResourceMap[];
  }

  async updateOneResourceMapById(
    id: number,
    attrs: ResourceMapAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceMapRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as ResourceMap;
  }

  async deleteOneResourceMapById(id: number, options?: TransactionOptions) {
    return this.resourceMapRepository.deleteOne({id}, options);
  }
}
