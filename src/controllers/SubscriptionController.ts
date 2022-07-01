import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {SubscriptionCreationAttributes} from '../models/Subscription';
import SubscriptionService from '../services/SubscriptionService';

export default class SubscriptionController {
  private subscriptionService: SubscriptionService;
  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  async createOneSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const toCreate: SubscriptionCreationAttributes = {
        ...req.body,
      };
      const createdSubscription =
        await this.subscriptionService.createOneSubscription(toCreate);
      res.status(201);
      res.json({
        message: userFriendlyMessages.success.createSubscription,
        data: createdSubscription,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.createSubscription});
      next(e);
    }
  }

  async getAllSubscriptions(res: Response, next: NextFunction) {
    try {
      const subscriptions =
        (await this.subscriptionService.getAllSubscription()) || [];
      res.json({
        message: userFriendlyMessages.success.getAllSubscriptions,
        data: subscriptions,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllSubscriptions});
      next(e);
    }
  }

  async getOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const subscription =
        await this.subscriptionService.getOneSubscriptionById(id);
      res.json({
        message: userFriendlyMessages.success.getOneSubscription,
        data: subscription,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneSubscription});
      next(e);
    }
  }

  async updateOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const oldSubscription =
        await this.subscriptionService.getOneSubscriptionById(id);
      const updatedAttributes = {
        ...oldSubscription,
        ...req.body,
      };
      const updatedSubscription =
        await this.subscriptionService.updateOneSubscriptionById(
          id,
          updatedAttributes
        );
      res.json({
        message: userFriendlyMessages.success.updateSubscription,
        data: updatedSubscription,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.updateSubscription});
      next(e);
    }
  }

  async deleteOneSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      await this.subscriptionService.deleteOneSubscriptionById(id);
      res.json({message: userFriendlyMessages.success.deleteSubscription});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteSubscription});
      next(e);
    }
  }
}
