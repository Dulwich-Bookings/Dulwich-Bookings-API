import {
  RecentlyVisitedAttributes,
  RecentlyVisitedCreationAttributes,
} from '../models/RecentlyVisited';
import RecentlyVisitedRepository from '../repositories/RecentlyVisitedRepository';
import RecentlyVisited from '../models/RecentlyVisited';

export default class RecentlyVisitedService {
  private recentlyVisitedRepository: RecentlyVisitedRepository;

  constructor(recentlyVisitedRepository: RecentlyVisitedRepository) {
    this.recentlyVisitedRepository = recentlyVisitedRepository;
  }

  async createOneRecentlyVisited(
    recentlyVisited: RecentlyVisitedCreationAttributes
  ) {
    return (await this.recentlyVisitedRepository.createOne(
      recentlyVisited
    )) as RecentlyVisited;
  }

  async getAllRecentlyVisiteds() {
    return (await this.recentlyVisitedRepository.getAll()) as RecentlyVisited[];
  }

  async getOneRecentlyVisitedById(id: number) {
    return (
      await this.recentlyVisitedRepository.getWithFilters({id})
    )[0] as RecentlyVisited;
  }

  async getRecentlyVisitedsByUserId(userId: number) {
    return (await this.recentlyVisitedRepository.getWithFilters({
      userId,
    })) as RecentlyVisited[];
  }

  async updateOneRecentlyVisitedById(
    id: number,
    attrs: RecentlyVisitedAttributes
  ) {
    return (await this.recentlyVisitedRepository.updateOne(attrs, {
      id,
    })) as RecentlyVisited;
  }

  async deleteOneRecentlyVisitedById(id: number) {
    return this.recentlyVisitedRepository.deleteOne({id});
  }
}
