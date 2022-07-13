import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {RecentlyVisitedCreationAttributes} from '../models/RecentlyVisited';
import RecentlyVisitedService from '../services/RecentlyVisitedService';

export default class RecentlyVisitedController {
  private recentlyVisitedService: RecentlyVisitedService;
  constructor(recentlyVisitedService: RecentlyVisitedService) {
    this.recentlyVisitedService = recentlyVisitedService;
  }

  async getSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const {user} = req;
      if (!user) {
        res
          .status(400)
          .send({message: userFriendlyMessages.failure.userNotExist});
        return;
      }
      const userId = user.id;
      const selfRecentlyVisited =
        await this.recentlyVisitedService.getRecentlyVisitedsByUserId(userId);
      res.json({
        message: userFriendlyMessages.success.getOneRecentlyVisited,
        data: selfRecentlyVisited,
      });
    } catch (e) {
      next(e);
    }
  }

  async createOneRecentlyVisited(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.id;
      const selfRecentlyVisited =
        await this.recentlyVisitedService.getRecentlyVisitedsByUserId(userId);

      // Each user can only have 6 recently visited at one time
      const isRecentlyVisitedFull = selfRecentlyVisited.length >= 6;
      if (isRecentlyVisitedFull) {
        let oldestRecentlyVisited = selfRecentlyVisited[1];
        for (const recentlyVisited of selfRecentlyVisited) {
          if (recentlyVisited.createdAt < oldestRecentlyVisited.createdAt) {
            oldestRecentlyVisited = recentlyVisited;
          }
        }
        await this.recentlyVisitedService.deleteOneRecentlyVisitedById(
          oldestRecentlyVisited.id
        );
      }

      const toCreate: RecentlyVisitedCreationAttributes = {
        ...req.body,
      };
      const createdRecentlyVisited =
        await this.recentlyVisitedService.createOneRecentlyVisited(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createRecentlyVisited,
        data: createdRecentlyVisited,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createRecentlyVisited});
      next(e);
    }
  }

  async getAllRecentlyVisiteds(res: Response, next: NextFunction) {
    try {
      const recentlyVisited =
        (await this.recentlyVisitedService.getAllRecentlyVisiteds()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllRecentlyVisited,
        data: recentlyVisited,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllRecentlyVisited});
      next(e);
    }
  }

  async getOneRecentlyVisitedById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const recentlyVisited =
        await this.recentlyVisitedService.getOneRecentlyVisitedById(id);
      res.json({
        message: userFriendlyMessages.success.getOneRecentlyVisited,
        data: recentlyVisited,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneRecentlyVisited});
      next(e);
    }
  }

  async updateOneRecentlyVisitedById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const oldRecentlyVisited =
        await this.recentlyVisitedService.getOneRecentlyVisitedById(id);
      const updatedAttributes = {
        ...oldRecentlyVisited,
        ...req.body,
      };
      const updatedRecentlyVisited =
        await this.recentlyVisitedService.updateOneRecentlyVisitedById(
          id,
          updatedAttributes
        );
      res.json({
        message: userFriendlyMessages.success.updateRecentlyVisited,
        data: updatedRecentlyVisited,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.updateRecentlyVisited});
      next(e);
    }
  }

  async deleteOneRecentlyVisitedById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      await this.recentlyVisitedService.deleteOneRecentlyVisitedById(id);
      res.json({message: userFriendlyMessages.success.deleteRecentlyVisited});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteRecentlyVisited});
      next(e);
    }
  }
}
