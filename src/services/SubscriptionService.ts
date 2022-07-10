import {
  SubscriptionAttributes,
  SubscriptionCreationAttributes,
} from '../models/Subscription';
import SubscriptionRepository from '../repositories/SubscriptionRepository';
import Subscription from '../models/Subscription';

export default class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async createOneSubscription(subscription: SubscriptionCreationAttributes) {
    return (await this.subscriptionRepository.createOne(
      subscription
    )) as Subscription;
  }

  async getAllSubscriptions() {
    return (await this.subscriptionRepository.getAll()) as Subscription[];
  }

  async getOneSubscriptionById(id: number) {
    return (
      await this.subscriptionRepository.getWithFilters({id})
    )[0] as Subscription;
  }

  async updateOneSubscriptionById(id: number, attrs: SubscriptionAttributes) {
    return (await this.subscriptionRepository.updateOne(attrs, {
      id,
    })) as Subscription;
  }

  async deleteOneSubscriptionById(id: number) {
    return this.subscriptionRepository.deleteOne({id});
  }
}
