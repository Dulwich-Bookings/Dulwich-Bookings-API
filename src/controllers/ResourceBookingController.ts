import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import ResourceBookingService from '../services/ResourceBookingService';
import {InvalidUTCStringError} from '../utils/datetimeUtils';

export default class ResourceBookingController {
  private resourceBookingService: ResourceBookingService;

  constructor(resourceBookingService: ResourceBookingService) {
    this.resourceBookingService = resourceBookingService;
  }

  async createOneResourceBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: add creation logic
    // try {
    // } catch (e) {
    //   res.status(400);
    //   if (e instanceof InvalidUTCStringError) {
    //     res.json({message: (e as Error).message});
    //   } else {
    //     res.json({message: userFriendlyMessages.failure.createResourceBooking});
    //   }
    //   next(e);
    // }
  }

  async getAllResourceBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: add logic
    // try {
    //   const schoolId = req.user.schoolId;
    //   const resourceBookings =
    //     (await this.resourceBookingService.getAllResourceBookings(schoolId)) ||
    //     [];
    //   res.json({
    //     message: userFriendlyMessages.success.getAllResourceBooking,
    //     data: resourceBookings,
    //   });
    // } catch (e) {
    //   res.status(400);
    //   res.json({message: userFriendlyMessages.failure.getAllResourceBooking});
    //   next(e);
    // }
  }

  async getMyResourceBookings(req: Request, res: Response, next: NextFunction) {
    // TODO: add logic
    // try {
    //   const userId = req.user.id;
    //   const resourceMaps =
    //     await this.resourceMapService.getResourceMapsByUserId(userId);
    //   const mySubscriptionIds = resourceMaps
    //     .filter(resourceMap => resourceMap.subscriptionId)
    //     .map(subscriptionMap => subscriptionMap.subscriptionId!);
    //   const resources =
    //     (await this.subscriptionService.getSubscriptionByIds(
    //       mySubscriptionIds
    //     )) || [];
    //   res.json({
    //     message: userFriendlyMessages.success.getAllResources,
    //     data: resources,
    //   });
    // } catch (e) {
    //   res.status(400);
    //   res.json({message: userFriendlyMessages.failure.getAllResources});
    //   next(e);
    // }
  }

  async getOneResourceBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: add logic
    // try {
    // } catch (e) {
    //   res.status(400);
    //   res.json({message: userFriendlyMessages.failure.getOneResourceBooking});
    //   next(e);
    // }
  }

  async updateOneResourceBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: add logic
    // try {
    // } catch (e) {
    //   res.status(400);
    //   if (e instanceof InvalidUTCStringError) {
    //     res.json({message: (e as Error).message});
    //   } else {
    //     res.json({message: userFriendlyMessages.failure.updateResourceBooking});
    //   }
    //   next(e);
    // }
  }

  async deleteOneResourceBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: add logic
    // try {
    // } catch (e) {
    //   res.status(400);
    //   res.json({message: userFriendlyMessages.failure.deleteResourceBooking});
    //   next(e);
    // }
  }
}
