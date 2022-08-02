import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {MilestoneCreationAttributes} from '../models/Milestone';
import MilestoneService from '../services/MilestoneService';
import UserService from '../services/UserService';
import {InvalidUTCStringError} from '../utils/datetimeUtils';

export default class MilestoneController {
  private milestoneService: MilestoneService;
  private userService: UserService;

  constructor(userService: UserService, milestoneService: MilestoneService) {
    this.userService = userService;
    this.milestoneService = milestoneService;
  }

  async getSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      const schoolId = user.schoolId;
      const selfMilestones =
        await this.milestoneService.getMilestonesBySchoolId(schoolId);
      res.json({
        message: userFriendlyMessages.success.getAllMilestone,
        data: selfMilestones,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllMilestone});
      next(e);
    }
  }

  async bulkCreateMilestones(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const schoolId = req.user.schoolId;
      const user = await this.userService.getOneUserById(userId, true);
      const password = req.body.password;
      if (!(await user.isPasswordMatch(password))) {
        res.status(401);
        res.json({message: userFriendlyMessages.failure.incorrectPassword});
        return;
      }

      const toCreateMilestones = req.body.milestones.map(
        (milestone: MilestoneCreationAttributes) => {
          return {...milestone, schoolId: schoolId};
        }
      );
      const newMilestones = await this.milestoneService.bulkCreateMilestone(
        toCreateMilestones
      );
      res.json({
        message: userFriendlyMessages.success.createMilestone,
        data: newMilestones,
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.createMilestone});
      }
      next(e);
    }
  }

  async bulkDeleteMilestones(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const user = await this.userService.getOneUserById(userId, true);
      const password = req.body.password;
      if (!(await user.isPasswordMatch(password))) {
        res.status(401);
        res.json({message: userFriendlyMessages.failure.incorrectPassword});
        return;
      }

      const schoolId = req.user.schoolId;
      const selfMilestones =
        await this.milestoneService.getMilestonesBySchoolId(schoolId);
      const toDeleteMilestones = selfMilestones.map(milestone => milestone.id);
      const deletedMilestone = await this.milestoneService.bulkDeleteMilestones(
        {
          id: toDeleteMilestones,
        }
      );

      res.json({
        message: userFriendlyMessages.success.deleteMilestone,
        data: deletedMilestone,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteMilestone});
      next(e);
    }
  }
}
