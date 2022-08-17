import {NextFunction, Request, Response} from 'express';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import ResourceBookingService from '../services/ResourceBookingService';
import ResourceService from '../services/ResourceService';
import ResourceBookingEventService from '../services/ResourceBookingEventService';
import {ResourceBookingEventCreationAttributes} from '../models/ResourceBookingEvent';
import {ResourceBookingCreationAttributes} from '../models/ResourceBooking';
import {InvalidUTCStringError} from '../utils/datetimeUtils';
import sequelize from '../db';

type CreateResourceBooking = ResourceBookingEventCreationAttributes &
  ResourceBookingCreationAttributes;

export default class ResourceBookingController {
  private resourceBookingService: ResourceBookingService;
  private resourceService: ResourceService;
  private resourceBookingEventService: ResourceBookingEventService;

  constructor(
    resourceBookingService: ResourceBookingService,
    resourceService: ResourceService,
    resourceBookingEventService: ResourceBookingEventService
  ) {
    this.resourceBookingService = resourceBookingService;
    this.resourceService = resourceService;
    this.resourceBookingEventService = resourceBookingEventService;
  }

  private isOverlap(
    newBooking: CreateResourceBooking,
    oldBooking: CreateResourceBooking
  ): boolean {
    const newStartTime = new Date(newBooking.startDateTime);
    const newEndTime = new Date(newBooking.endDateTime);

    const oldStartTime = new Date(oldBooking.startDateTime);
    const oldEndTime = new Date(oldBooking.endDateTime);

    const caseOne =
      newEndTime.getTime() > oldStartTime.getTime() &&
      newStartTime.getTime() < oldStartTime.getTime();
    const caseTwo =
      newStartTime.getTime() < oldEndTime.getTime() &&
      newEndTime.getTime() > oldEndTime.getTime();
    const caseThree =
      newStartTime.getTime() <= oldEndTime.getTime() &&
      newStartTime.getTime() >= oldStartTime.getTime() &&
      newEndTime.getTime() <= oldEndTime.getTime() &&
      newEndTime.getTime() >= oldStartTime.getTime();

    return caseOne || caseTwo || caseThree;
  }

  private validateOverlap(
    newBookings: CreateResourceBooking[],
    oldBookings: CreateResourceBooking[]
  ) {
    for (let i = 0; i < oldBookings.length; i++) {
      for (let j = 0; j < newBookings.length; j++) {
        const oldBooking = oldBookings[i];
        const newBooking = newBookings[j];
        if (this.isOverlap(newBooking, oldBooking)) return false;
      }
    }
    return true;
  }

  async createOneResourceBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await sequelize.transaction(async t => {
        const userId = req.user.id;
        const newBooking = req.body as CreateResourceBooking;
        const resourceId = newBooking.resourceId;
        const resourceBookings =
          await this.resourceBookingService.getResourceBookingsByResourceIds([
            resourceId,
          ]);

        // Case 1. no recurring booking
        if (!newBooking.RRULE) {
          // Check for Booking Overlap
          if (!this.validateOverlap([newBooking], resourceBookings)) {
            res.status(400);
            res.json({message: userFriendlyMessages.failure.bookingOverlap});
            return;
          }

          // Create new ResourceBooking
          const toCreateResourceBooking: ResourceBookingCreationAttributes = {
            userId: userId,
            resourceId: newBooking.resourceId,
            description: newBooking.description,
            bookingState: newBooking.bookingState,
            bookingType: newBooking.bookingType,
          };
          const createdBooking =
            await this.resourceBookingService.createOneResourceBooking(
              toCreateResourceBooking,
              {transaction: t}
            );

          // Create new ResourceBookingEvent
          const toCreateResourceBookingEvent: ResourceBookingEventCreationAttributes =
            {
              resourceBookingId: 1,
              startDateTime: newBooking.startDateTime,
              endDateTime: newBooking.endDateTime,
            };
          const createdBookingEvent =
            await this.resourceBookingEventService.createOneResourceBookingEvent(
              toCreateResourceBookingEvent,
              {transaction: t}
            );

          res.json({
            message: userFriendlyMessages.success.createResourceBooking,
            data: {
              ...createdBooking,
              ...createdBookingEvent,
            },
          });
        }
      });
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.createResourceBooking});
      }
      next(e);
    }
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
