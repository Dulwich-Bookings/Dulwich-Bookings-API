import {
  ResourceBookingEventAttributes,
  ResourceBookingEventCreationAttributes,
} from '../models/ResourceBookingEvent';
import ResourceBookingEventRepository from '../repositories/ResourceBookingEventRepository';
import ResourceBookingEvent from '../models/ResourceBookingEvent';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class ResourceBookingEventService {
  private resourceBookingEventRepository: ResourceBookingEventRepository;

  constructor(resourceBookingEventRepository: ResourceBookingEventRepository) {
    this.resourceBookingEventRepository = resourceBookingEventRepository;
  }

  async createOneResourceBookingEvent(
    resourceBookingEvent: ResourceBookingEventCreationAttributes,
    options?: TransactionOptions
  ) {
    return (
      await this.resourceBookingEventRepository.createOne(
        resourceBookingEvent,
        options
      )
    ).get({plain: true}) as ResourceBookingEvent;
  }

  async getResourceBookingEventsByResourceBookingId(
    resourceBookingIds: number[]
  ) {
    return (await this.resourceBookingEventRepository.getWithFilters({
      resourceBookingId: resourceBookingIds,
    })) as ResourceBookingEvent[];
  }

  async getOneResourceBookingEventById(id: number) {
    return (
      await this.resourceBookingEventRepository.getWithFilters({id})
    )[0] as ResourceBookingEvent;
  }

  async updateOneResourceBookingEventById(
    id: number,
    attrs: ResourceBookingEventAttributes,
    options?: TransactionOptions
  ) {
    return (await this.resourceBookingEventRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as ResourceBookingEvent;
  }

  async deleteOneResourceBookingEventById(
    id: number,
    options?: TransactionOptions
  ) {
    return this.resourceBookingEventRepository.deleteOne({id}, options);
  }
}
