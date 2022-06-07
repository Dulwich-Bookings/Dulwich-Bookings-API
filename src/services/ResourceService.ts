import {
  ResourceAttributes,
  ResourceCreationAttributes,
} from '../models/Resource';
import ResourceRepository from '../repositories/ResourceRepository';
import Resource from '../models/Resource';

export default class ResourceService {
  private resourceRepository: ResourceRepository;

  constructor(resourceRepository: ResourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async createOneResource(resource: ResourceCreationAttributes) {
    return (await this.resourceRepository.createOne(resource)) as Resource;
  }

  async getAllResources() {
    return (await this.resourceRepository.getAll()) as Resource[];
  }

  async getOneResourceById(id: number) {
    return (await this.resourceRepository.getWithFilters({id}))[0] as Resource;
  }

  async updateOneResourceById(id: number, attrs: ResourceAttributes) {
    return (await this.resourceRepository.updateOne(attrs, {id})) as Resource;
  }

  async deleteOneResourceById(id: number) {
    return this.resourceRepository.deleteOne({id});
  }
}
