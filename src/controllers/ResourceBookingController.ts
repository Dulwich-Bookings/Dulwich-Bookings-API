import {NextFunction, Request, Response} from 'express';
import {RRule, RRuleSet, rrulestr} from 'rrule';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import ResourceBookingService from '../services/ResourceBookingService';
import ResourceBookingEventService from '../services/ResourceBookingEventService';
import {ResourceBookingEventCreationAttributes} from '../models/ResourceBookingEvent';
import {ResourceBookingCreationAttributes} from '../models/ResourceBooking';
import {InvalidUTCStringError} from '../utils/datetimeUtils';
import sequelize from '../db';
import DateTimeInterval from '../modules/timeInterval/DateTimeInterval';

export type CreateResourceBooking = ResourceBookingEventCreationAttributes &
  ResourceBookingCreationAttributes;

export default class ResourceBookingController {
  private resourceBookingService: ResourceBookingService;
  private resourceBookingEventService: ResourceBookingEventService;

  constructor(
    resourceBookingService: ResourceBookingService,
    resourceBookingEventService: ResourceBookingEventService
  ) {
    this.resourceBookingService = resourceBookingService;
    this.resourceBookingEventService = resourceBookingEventService;
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
          await this.resourceBookingService.getResourceBookingsByResourceId(
            resourceId
          );

        // Check for booking overlap
        const newBookingIntervals =
          DateTimeInterval.createDateTimeIntervalsFromResourceBooking(
            newBooking
          );
        const resourceBookingIntervals = resourceBookings.flatMap(
          resourceBooking =>
            DateTimeInterval.createDateTimeIntervalsFromResourceBooking(
              resourceBooking
            )
        );
        if (
          DateTimeInterval.hasOverlapsBetween(
            newBookingIntervals,
            resourceBookingIntervals
          )
        ) {
          res.status(400);
          res.json({message: userFriendlyMessages.failure.bookingOverlap});
          return;
        }

        // Case 1. non-recurring booking
        if (!newBooking.RRULE) {
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
              resourceBookingId: createdBooking.id,
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

        // Case 2. recurring booking
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

  async getResourceBookingsByResourceId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const resourceId = parseInt(req.params.id);
      const resourceBookings =
        (await this.resourceBookingService.getResourceBookingsByResourceId(
          resourceId
        )) || [];
      res.json({
        message: userFriendlyMessages.success.getResourceBookings,
        data: resourceBookings,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getResourceBookings});
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
        message: userFriendlyMessages.success.getResourceBookings,
        data: resourceBookings,
      });
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.getResourceBookings});
      next(e);
    }
  }

  async updateThisEvent(req: Request, res: Response, next: NextFunction) {
    // try {
    //   await sequelize.transaction(async t => {
    //     const newBooking = req.body.newBooking as CreateResourceBooking;
    //     const resourceId = newBooking.resourceId;
    //     const resourceBookings =
    //       await this.resourceBookingService.getResourceBookingsByResourceId(
    //         resourceId
    //       );
    //     if (!this.validateOverlap([newBooking], resourceBookings)) {
    //       res.status(400);
    //       res.json({message: userFriendlyMessages.failure.bookingOverlap});
    //       return;
    //     }
    //     const eventId = parseInt(req.params.id);
    //     const {oldStartDateTime} = req.body;
    //     const userId = req.user.id;
    //     const oldResourceBookingEvent =
    //       await this.resourceBookingEventService.getOneResourceBookingEventById(
    //         eventId
    //       );
    //     const {RRULE} = oldResourceBookingEvent;
    //     // If non-recurring:
    //     if (!RRULE) {
    //       // Update resourceBooking
    //       const {resourceBookingId} = oldResourceBookingEvent;
    //       const oldResourceBooking =
    //         await this.resourceBookingService.getOneResourceBookingById(
    //           resourceBookingId
    //         );
    //       const updatedResourceBookingAttributes = {
    //         ...oldResourceBooking,
    //         description: newBooking.description,
    //         bookingState: newBooking.bookingState,
    //         bookingType: newBooking.bookingType,
    //       };
    //       const updatedResourceBooking =
    //         await this.resourceBookingService.updateOneResourceBookingById(
    //           resourceBookingId,
    //           updatedResourceBookingAttributes,
    //           {transaction: t}
    //         );
    //       // Update resourceBookingEvent
    //       res.json({
    //         message: userFriendlyMessages.success.updateResourceBooking,
    //       });
    //       return;
    //     }
    //     // If recurring, add excluded date to original RRULE
    //     const rRuleObject = rrulestr(RRULE, {
    //       forceset: true,
    //     }) as RRuleSet;
    //     rRuleObject.exdate(new Date(oldStartDateTime));
    //     const newRRULE = rRuleObject.toString();
    //     const updatedAttributes = {
    //       ...oldResourceBookingEvent,
    //       RRULE: newRRULE,
    //     };
    //     await this.resourceBookingEventService.updateOneResourceBookingEventById(
    //       eventId,
    //       updatedAttributes
    //     );
    //     // Create new non-recurring resourceBooking
    //     const toCreateResourceBooking: ResourceBookingCreationAttributes = {
    //       userId: userId,
    //       resourceId: newBooking.resourceId,
    //       description: newBooking.description,
    //       bookingState: newBooking.bookingState,
    //       bookingType: newBooking.bookingType,
    //     };
    //     const createdBooking =
    //       await this.resourceBookingService.createOneResourceBooking(
    //         toCreateResourceBooking,
    //         {transaction: t}
    //       );
    //     // Create new ResourceBookingEvent
    //     const toCreateResourceBookingEvent: ResourceBookingEventCreationAttributes =
    //       {
    //         resourceBookingId: createdBooking.id,
    //         startDateTime: newBooking.startDateTime,
    //         endDateTime: newBooking.endDateTime,
    //       };
    //     const createdBookingEvent =
    //       await this.resourceBookingEventService.createOneResourceBookingEvent(
    //         toCreateResourceBookingEvent,
    //         {transaction: t}
    //       );
    //     res.json({
    //       message: userFriendlyMessages.success.updateThisEvent,
    //       data: {
    //         ...createdBooking,
    //         ...createdBookingEvent,
    //       },
    //     });
    //   });
    // } catch (e) {
    //   res.status(400);
    //   if (e instanceof InvalidUTCStringError) {
    //     res.json({message: (e as Error).message});
    //   } else {
    //     res.json({message: userFriendlyMessages.failure.updateThisEvent});
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
    //     res.json({message: userFriendlyMessages.failure.updateThisAndFollowingEvent});
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

      res.json({message: userFriendlyMessages.success.updateAllEvents});
    } catch (e) {
      res.status(400);
      if (e instanceof InvalidUTCStringError) {
        res.json({message: (e as Error).message});
      } else {
        res.json({message: userFriendlyMessages.failure.updateAllEvents});
      }
      next(e);
    }
  }

  async deleteThisEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id);
      const {startDateTime} = req.body;
      const oldResourceBookingEvent =
        await this.resourceBookingEventService.getOneResourceBookingEventById(
          eventId
        );

      const {RRULE} = oldResourceBookingEvent;
      if (!RRULE) {
        const {resourceBookingId} = oldResourceBookingEvent;
        await this.resourceBookingService.deleteOneResourceBookingById(
          resourceBookingId
        );
        res.json({message: userFriendlyMessages.success.deleteResourceBooking});
        return;
      }
      const rRuleObject = rrulestr(RRULE, {
        forceset: true,
      }) as RRuleSet;

      // Add excluded date to RRULE
      rRuleObject.exdate(new Date(startDateTime));
      const newRRULE = rRuleObject.toString();
      const updatedAttributes = {
        ...oldResourceBookingEvent,
        RRULE: newRRULE,
      };
      await this.resourceBookingEventService.updateOneResourceBookingEventById(
        eventId,
        updatedAttributes
      );
      res.json({message: userFriendlyMessages.success.deleteThisEvent});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteThisEvent});
      next(e);
    }
  }

  async deleteThisAndFollowingEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = parseInt(req.params.id);
      const {startDateTime} = req.body;
      const oldResourceBookingEvent =
        await this.resourceBookingEventService.getOneResourceBookingEventById(
          eventId
        );

      // Non-recurring events are not allowed to delete this and following events.
      // This event must have a RRULE. Thus, the typecast from string | undefined
      // to string is safe.
      const RRULE = oldResourceBookingEvent.RRULE as string;
      const rRuleObject = rrulestr(RRULE, {
        forceset: true,
      }) as RRuleSet;

      // Add exclusion rule to RRULE to exclude all dates after selected datetime (inclusive)
      rRuleObject.exrule(
        new RRule({
          freq: RRule.WEEKLY,
          dtstart: new Date(startDateTime),
        })
      );
      const newRRULE = rRuleObject.toString();

      const updatedAttributes = {
        ...oldResourceBookingEvent,
        RRULE: newRRULE,
      };
      await this.resourceBookingEventService.updateOneResourceBookingEventById(
        eventId,
        updatedAttributes
      );

      // Delete all events after selected datetime (inclusive)
      const {resourceBookingId} = oldResourceBookingEvent;
      const associatedEvents =
        (await this.resourceBookingEventService.getResourceBookingEventsByResourceBookingId(
          resourceBookingId
        )) || [];
      const toDeleteEvents = associatedEvents.filter(event => {
        // Non-recurring events are not allowed to delete this and following events.
        // This event must have a RRULE. Thus, the typecast from string | undefined
        // to string is safe.
        const eventRRULE = event.RRULE as string;
        const eventRRuleObject = rrulestr(eventRRULE, {
          forceset: true,
        }) as RRuleSet;

        if (eventRRuleObject.after(new Date(startDateTime), true)) {
          return true;
        }
        return false;
      });
      const toDeleteEventIds = toDeleteEvents.map(event => event.id);
      await this.resourceBookingEventService.bulkDeleteResourceBookingEvents({
        id: toDeleteEventIds,
      });
      res.json({
        message: userFriendlyMessages.success.deleteThisAndFollowingEvent,
      });
    } catch (e) {
      res.status(400);
      res.json({
        message: userFriendlyMessages.failure.deleteThisAndFollowingEvent,
      });
      next(e);
    }
  }

  async deleteAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id);
      const resourceBookingEvent =
        await this.resourceBookingEventService.getOneResourceBookingEventById(
          eventId
        );
      const {resourceBookingId} = resourceBookingEvent;
      await this.resourceBookingService.deleteOneResourceBookingById(
        resourceBookingId
      );
      res.json({message: userFriendlyMessages.success.deleteAllEvents});
    } catch (e) {
      res.status(400);
      res.json({message: userFriendlyMessages.failure.deleteAllEvents});
      next(e);
    }
  }
}
