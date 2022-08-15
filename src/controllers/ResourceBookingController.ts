import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import ResourceBookingService from '../services/ResourceBookingService';
import ResourceService from '../services/ResourceService';
import {InvalidUTCStringError} from '../utils/datetimeUtils';

export default class ResourceBookingController {
  private resourceBookingService: ResourceBookingService;
  private resourceService: ResourceService;

  constructor(
    resourceBookingService: ResourceBookingService,
    resourceService: ResourceService
  ) {
    this.resourceBookingService = resourceBookingService;
    this.resourceService = resourceService;
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
    try {
      const schoolId = req.user.schoolId;
      const resources =
        (await this.resourceService.getAllResources(schoolId)) || [];
      const resourceIds = resources.map(resource => resource.id);
      const resourceBookings =
        (await this.resourceBookingService.getResourceBookingsByResourceIds(
          resourceIds
        )) || [];
      res.json({
        message: userFriendlyMessages.success.getAllResourceBooking,
        data: resourceBookings,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllResourceBooking});
      next(e);
    }
  }

  async getMyResourceBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const resourceBookings =
        (await this.resourceBookingService.getResourceBookingsByUserId(
          userId
        )) || [];
      res.json({
        message: userFriendlyMessages.success.getAllResourceBooking,
        data: resourceBookings,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getAllResourceBooking});
      next(e);
    }
  }

  async getOneResourceBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const resourceBooking =
        await this.resourceBookingService.getOneResourceBookingById(id);
      res.json({
        message: userFriendlyMessages.success.getOneResourceBooking,
        data: resourceBooking,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getOneResourceBooking});
      next(e);
    }
  }

  async updateThisEvent(req: Request, res: Response, next: NextFunction) {
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
  async updateThisAndFollowingEvents(
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

  async updateAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      // TODO: add logic
      // if time was changed, need to loop through everything to update the time
      // else, just update the resourceBooking

      res.json({message: userFriendlyMessages.success.updateResourceBooking});
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.updateResourceBooking});
      }
      next(e);
    }
  }

  async deleteThisEvent(req: Request, res: Response, next: NextFunction) {
    // TODO: add logic
    // try {
    // } catch (e) {
    //   res.status(400);
    //   res.json({message: userFriendlyMessages.failure.deleteResourceBooking});
    //   next(e);
    // }
  }

  async deleteThisAndFollowingEvents(
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

  async deleteAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.resourceBookingService.deleteOneResourceBookingById(id);
      res.json({message: userFriendlyMessages.success.deleteResourceBooking});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteResourceBooking});
      next(e);
    }
  }
}
