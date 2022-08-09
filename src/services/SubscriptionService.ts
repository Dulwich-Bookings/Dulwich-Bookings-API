import {
  SubscriptionAttributes,
  SubscriptionCreationAttributes,
} from '../models/Subscription';
import SubscriptionRepository from '../repositories/SubscriptionRepository';
import Subscription from '../models/Subscription';
import {TransactionOptions} from '../repositories/BaseRepository';

export default class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async createOneSubscription(
    subscription: SubscriptionCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.subscriptionRepository.createOne(
      subscription,
      options
    )) as Subscription;
  }

  async getAllSubscriptions(schoolId: number) {
    return (await this.subscriptionRepository.getWithFilters({
      schoolId,
    })) as Subscription[];
  }

  async getSubscriptionByIds(ids: number[]) {
    return (await this.subscriptionRepository.getWithFilters({
      id: ids,
    })) as Subscription[];
  }

  async getOneSubscriptionById(id: number) {
    return (
      await this.subscriptionRepository.getWithFilters({id})
    )[0] as Subscription;
  }

  async updateOneSubscriptionById(
    id: number,
    attrs: SubscriptionAttributes,
    options?: TransactionOptions
  ) {
    return (await this.subscriptionRepository.updateOne(
      attrs,
      {
        id,
      },
      options
    )) as Subscription;
  }

  async deleteOneSubscriptionById(id: number, options?: TransactionOptions) {
    return this.subscriptionRepository.deleteOne({id}, options);
  }
}
