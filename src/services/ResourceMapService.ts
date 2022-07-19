import ResourceMap, {
  ResourceMapAttributes,
  ResourceMapCreationAttributes,
} from '../models/ResourceMap';
import ResourceMapRepository from '../repositories/ResourceMapRepository';
import {DeleteOptions} from './UserService';

export default class ResourceMapService {
  private resourceMapRepository: ResourceMapRepository;

  constructor(resourceMapRepository: ResourceMapRepository) {
    this.resourceMapRepository = resourceMapRepository;
  }

  async createOneResourceMap(resourceMap: ResourceMapCreationAttributes) {
    return (await this.resourceMapRepository.createOne(
      resourceMap
    )) as ResourceMap;
  }

  async getAllResourceMaps() {
    return (await this.resourceMapRepository.getAll()) as ResourceMap[];
  }

  async bulkCreateResourceMap(resourceMaps: ResourceMapCreationAttributes[]) {
    return (await this.resourceMapRepository.bulkCreate(
      resourceMaps
    )) as ResourceMap[];
  }

  async bulkDeleteResourceMap(resourceMaps: DeleteOptions) {
    return await this.resourceMapRepository.bulkDelete(resourceMaps);
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

  async updateOneResourceMapById(id: number, attrs: ResourceMapAttributes) {
    return (await this.resourceMapRepository.updateOne(attrs, {
      id,
    })) as ResourceMap;
  }

  async deleteOneResourceMapById(id: number) {
    return this.resourceMapRepository.deleteOne({id});
  }
}
