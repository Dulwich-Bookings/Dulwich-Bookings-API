import {MilestoneCreationAttributes} from '../models/Milestone';
import MilestoneRepository from '../repositories/MilestoneRepository';
import Milestone from '../models/Milestone';
import {TransactionOptions} from '../repositories/BaseRepository';
import {DeleteOptions} from '../services/UserService';

export default class MilestoneService {
  private milestoneRepository: MilestoneRepository;

  constructor(milestoneRepository: MilestoneRepository) {
    this.milestoneRepository = milestoneRepository;
  }

  async createOneMilestone(
    milestone: MilestoneCreationAttributes,
    options?: TransactionOptions
  ) {
    return (await this.milestoneRepository.createOne(
      milestone,
      options
    )) as Milestone;
  }

  async bulkCreateMilestone(milestones: MilestoneCreationAttributes[]) {
    return (await this.milestoneRepository.bulkCreate(
      milestones
    )) as Milestone[];
  }

  async getAllMilestones() {
    return (await this.milestoneRepository.getAll()) as Milestone[];
  }

  async getOneMilestoneById(id: number) {
    return (
      await this.milestoneRepository.getWithFilters({id})
    )[0] as Milestone;
  }

  async getMilestonesBySchoolId(schoolId: number) {
    return (await this.milestoneRepository.getWithFilters({
      schoolId,
    })) as Milestone[];
  }

  async deleteOneMilestoneById(id: number, options?: TransactionOptions) {
    return this.milestoneRepository.deleteOne({id}, options);
  }

  async bulkDeleteMilestones(
    milestones: DeleteOptions,
    options?: TransactionOptions
  ) {
    return await this.milestoneRepository.bulkDelete(milestones, options);
  }
}
