import {
  ResourceBookingAttributes,
  ResourceBookingCreationAttributes,
} from '../models/ResourceBooking';
import ResourceBookingRepository from '../repositories/ResourceBookingRepository';
import ResourceBooking from '../models/ResourceBooking';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class ResourceBookingService {
  private resourceBookingRepository: ResourceBookingRepository;

  constructor(resourceBookingRepository: ResourceBookingRepository) {
    this.resourceBookingRepository = resourceBookingRepository;
  }

  async createOneResourceBooking(
    resourceBooking: ResourceBookingCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceBookingRepository.createOne(
      resourceBooking,
      options
    )) as ResourceBooking;
  }

  async getAllResourceBookings(schoolId: number) {
    return (await this.resourceBookingRepository.getWithFilters({
      schoolId,
    })) as ResourceBooking[];
  }

  async getResourceBookingByIds(ids: number[]) {
    return (await this.resourceBookingRepository.getWithFilters({
      id: ids,
    })) as ResourceBooking[];
  }

  async getOneResourceBookingById(id: number) {
    return (
      await this.resourceBookingRepository.getWithFilters({id})
    )[0] as ResourceBooking;
  }

  async updateOneResourceBookingById(
    id: number,
    attrs: ResourceBookingAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceBookingRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as ResourceBooking;
  }

  async deleteOneResourceBookingById(id: number, options?: TransactionOptions) {
    return this.resourceBookingRepository.deleteOne({id}, options);
  }
}
