import {NextFunction, Request, Response} from 'express';
import {RRule, RRuleSet, rrulestr} from 'rrule';
import moment, {Moment} from 'moment';

import userFriendlyMessages from '../consts/userFriendlyMessages';
import ResourceBookingService from '../services/ResourceBookingService';
import ResourceBookingEventService from '../services/ResourceBookingEventService';
import MilestoneService from '../services/MilestoneService';
import {ResourceBookingEventCreationAttributes} from '../models/ResourceBookingEvent';
import {ResourceBookingCreationAttributes} from '../models/ResourceBooking';
import {InvalidUTCStringError, momentToString} from '../utils/datetimeUtils';
import sequelize from '../db';
import DateTimeInterval from '../modules/timeInterval/DateTimeInterval';
import {WeekProfile} from '../consts/enums';
import Milestone, {compareByWeekBeginning} from '../models/Milestone';

export type CreateResourceBooking = ResourceBookingEventCreationAttributes &
  ResourceBookingCreationAttributes;

export default class ResourceBookingController {
  private resourceBookingService: ResourceBookingService;
  private resourceBookingEventService: ResourceBookingEventService;
  private milestoneService: MilestoneService;

  constructor(
    resourceBookingService: ResourceBookingService,
    resourceBookingEventService: ResourceBookingEventService,
    milestoneService: MilestoneService
  ) {
    this.resourceBookingService = resourceBookingService;
    this.resourceBookingEventService = resourceBookingEventService;
    this.milestoneService = milestoneService;
  }

  async createOneResourceBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await sequelize.transaction(async t => {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
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

        // Case 1. non-recurring booking
        if (!newBooking.RRULE) {
          // Create new ResourceBookingEvent with no recurrence
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
          return;
        }

        // Case 2. recurring booking
        const rRule = rrulestr(newBooking.RRULE as string);
        if (rRule.options.interval === WeekProfile.WEEKLY) {
          // Create new ResourceBookingEvent with weekly recurrence
          const toCreateResourceBookingEvent: ResourceBookingEventCreationAttributes =
            {
              resourceBookingId: createdBooking.id,
              startDateTime: newBooking.startDateTime,
              endDateTime: newBooking.endDateTime,
              RRULE: newBooking.RRULE,
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
          return;
        }

        if (rRule.options.interval === WeekProfile.BIWEEKLY) {
          const milestones =
            await this.milestoneService.getMilestonesBySchoolId(schoolId);
          milestones.sort(compareByWeekBeginning);

          // Determine milestone that new resourceBooking is starting from
          const startDateTime = moment.utc(newBooking.startDateTime);
          const endDateTime = moment.utc(newBooking.endDateTime);
          let currentMilestoneIdx = -1;
          for (let i = 0; i < milestones.length; i++) {
            const m = moment.utc(milestones[i].weekBeginning);
            if (m > startDateTime) {
              break;
            }
            currentMilestoneIdx++;
          }
          if (currentMilestoneIdx === -1) {
            // if new booking is before any milestone
            return;
          }

          // Determine the week number this new booking belongs to
          const currentMilestoneWeekBeginning = moment.utc(
            milestones[currentMilestoneIdx].weekBeginning
          );
          const diffInWeeks =
            startDateTime.diff(currentMilestoneWeekBeginning, 'weeks') % 2;
          const bookingWeek =
            milestones[currentMilestoneIdx].week + diffInWeeks;

          let remainingBookingDates = rRule.all();
          const remainingBookingRRule = rRule;
          let currentStartDateTime = startDateTime;
          let currentEndDateTime = endDateTime;
          while (remainingBookingDates.length !== 0) {
            const nextMilestoneIdx = currentMilestoneIdx + 1;
            // If booking exceeds last milestone
            if (nextMilestoneIdx >= milestones.length) {
              break;
            }

            const nextMilestoneWeekBeginning = moment.utc(
              milestones[nextMilestoneIdx].weekBeginning
            );
            for (let i = 0; i < remainingBookingDates.length; i++) {
              const bookingDate = moment.utc(remainingBookingDates[i]);
              if (bookingDate > nextMilestoneWeekBeginning) {
                // Bisect dates by creating a new rRule which excludes dates after next milestone
                const rRuleToSave = new RRule(remainingBookingRRule.options);
                if (rRuleToSave.options.count) {
                  rRuleToSave.options.count = i;
                } else {
                  rRuleToSave.options.until =
                    nextMilestoneWeekBeginning.toDate();
                }

                const toCreateResourceBookingEvent: ResourceBookingEventCreationAttributes =
                  {
                    resourceBookingId: createdBooking.id,
                    startDateTime: momentToString(currentStartDateTime),
                    endDateTime: momentToString(currentEndDateTime),
                    RRULE: RRule.optionsToString(rRuleToSave.options),
                  };
                await this.resourceBookingEventService.createOneResourceBookingEvent(
                  toCreateResourceBookingEvent,
                  {transaction: t}
                );

                // Update currentStartDateTime, currentEndDateTime, and remainingBookingRRule
                currentMilestoneIdx = nextMilestoneIdx;
                currentStartDateTime = this.translateDateTimeFromMilestone(
                  milestones[currentMilestoneIdx],
                  startDateTime,
                  bookingWeek
                );
                currentEndDateTime = this.translateDateTimeFromMilestone(
                  milestones[currentMilestoneIdx],
                  endDateTime,
                  bookingWeek
                );
                if (remainingBookingRRule.options.count) {
                  remainingBookingRRule.options.count -= i;
                }
                remainingBookingRRule.options.dtstart =
                  currentStartDateTime.toDate();
                remainingBookingDates = remainingBookingRRule.all();
                break;
              }
            }
            // All remaining bookings are before the next deadline
            break;
          }
          const toCreateResourceBookingEvent: ResourceBookingEventCreationAttributes =
            {
              resourceBookingId: createdBooking.id,
              startDateTime: momentToString(currentStartDateTime),
              endDateTime: momentToString(currentEndDateTime),
              RRULE: RRule.optionsToString(remainingBookingRRule.options),
            };
          await this.resourceBookingEventService.createOneResourceBookingEvent(
            toCreateResourceBookingEvent,
            {transaction: t}
          );
          res.json({
            message: userFriendlyMessages.success.createResourceBooking,
          });
          return;
        }
        res.status(400);
        res.json({message: userFriendlyMessages.failure.invalidWeekProfile});
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

  /**
   * Translates Milestone beginning date to same weekday, hour, minute, and second
   * as given referenceDateTime
   * @param milestone given Milestone to translate
   * @param referenceDateTime reference DateTime to translate
   * @param bookingWeek week number that booking belongs to
   * @returns Moment object representing the translated
   */
  private translateDateTimeFromMilestone(
    milestone: Milestone,
    referenceDateTime: Moment,
    bookingWeek: number
  ): Moment {
    const isoWeekday = referenceDateTime.isoWeekday();
    const hour = referenceDateTime.hour();
    const minute = referenceDateTime.minute();
    const second = referenceDateTime.second();
    const translatedDateTime = moment.utc(milestone.weekBeginning);

    if (milestone.week !== bookingWeek) {
      translatedDateTime.add(1, 'weeks');
    }
    translatedDateTime.isoWeekday(isoWeekday);
    translatedDateTime.hour(hour);
    translatedDateTime.minute(minute);
    translatedDateTime.second(second);

    return translatedDateTime;
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
