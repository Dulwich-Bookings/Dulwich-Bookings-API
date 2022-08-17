import {
  ResourceBookingAttributes,
  ResourceBookingCreationAttributes,
} from '../models/ResourceBooking';
import ResourceBookingRepository from '../repositories/ResourceBookingRepository';
import {ResourceBookingEvent, ResourceBooking} from '../models';
import {TransactionOptions} from '../repositories/BaseRepository';
import sequelize from '../db';
import {QueryTypes} from 'sequelize';

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

  async getResourceBookingsByResourceIds(resourceIds: number[]) {
    const resourceBookings = (await sequelize.query(
      `SELECT * FROM resource_bookings JOIN resource_booking_events 
      ON resource_bookings.id = resource_booking_events."resourceBookingId" 
      AND public.resource_bookings."resourceId" IN(:resourceIds);`,
      {replacements: {resourceIds}, type: QueryTypes.SELECT}
    )) as (ResourceBooking & ResourceBookingEvent)[];
    return resourceBookings;
  }

  async getResourceBookingsByUserId(userId: number) {
    const resourceBookings = (await sequelize.query(
      `SELECT * FROM resource_bookings JOIN resource_booking_events 
      ON resource_bookings.id = resource_booking_events."resourceBookingId" 
      AND public.resource_bookings."userId" = :userId;`,
      {replacements: {userId}, type: QueryTypes.SELECT}
    )) as (ResourceBooking & ResourceBookingEvent)[];
    return resourceBookings;
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
