import moment, {Moment} from 'moment';
import {RRuleSet, rrulestr} from 'rrule';
import {CreateResourceBooking} from '../../controllers/ResourceBookingController';
import {validateUTCString} from '../../utils/datetimeUtils';

class DateTimeInterval {
  private startDateTime: Moment;
  private endDateTime: Moment;

  /**
   * Constructor to create a new DateTimeInterval
   * @param startDateTime start datetime in Moment
   * @param endDateTime end datetime in Moment
   */
  private constructor(startDateTime: Moment, endDateTime: Moment) {
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }

  /**
   * Factory method to create DateTimeInterval using datetimes in UTC string format
   * @param startDateTime start datetime in UTC string format
   * @param endDateTime end datetime in UTC string format
   * @returns new DateTimeInterval
   * @throws {InvalidUTCStringError} if start and end datetime are not in UTC format
   */
  public static createDateTimeIntervalFromUTCString(
    startDateTime: string,
    endDateTime: string
  ): DateTimeInterval {
    validateUTCString(startDateTime);
    validateUTCString(endDateTime);
    return new DateTimeInterval(
      moment.utc(startDateTime),
      moment.utc(endDateTime)
    );
  }

  /**
   * Creates array of DateTimeIntervals from resourceBooking
   * @param resourceBooking resourceBooking representing recurring or non-recurring events
   * @returns array of one DateTimeInterval representing event, if resourceBooking is
   * non-recurring. Array of DateTimeIntervals representing events, if resourceBooking is
   * recurring.
   */
  public static createDateTimeIntervalsFromResourceBooking(
    resourceBooking: CreateResourceBooking
  ): DateTimeInterval[] {
    if (!resourceBooking.RRULE) {
      return [
        DateTimeInterval.createDateTimeIntervalFromUTCString(
          resourceBooking.startDateTime,
          resourceBooking.endDateTime
        ),
      ];
    }

    const bookingRRule = rrulestr(resourceBooking.RRULE, {
      forceset: true,
    }) as RRuleSet;

    const startDateTimes = bookingRRule.all().map(start => moment(start));
    const difference = moment
      .utc(resourceBooking.endDateTime)
      .diff(moment.utc(resourceBooking.startDateTime));
    const endDateTimes = bookingRRule
      .all()
      .map(start => moment.utc(start).add(difference));

    const dateTimeIntervals: DateTimeInterval[] = [];
    for (let i = 0; i < startDateTimes.length; i++) {
      const startMoment = startDateTimes[i];
      const endMoment = endDateTimes[i];
      dateTimeIntervals.push(new DateTimeInterval(startMoment, endMoment));
    }
    return dateTimeIntervals;
  }

  /**
   * Checks if this interval overlaps with another datetime interval
   * @param other the other datetime interval to compare with
   * @returns true, if the two intervals overlap. Otherwise false.
   */
  public overlaps(other: DateTimeInterval): boolean {
    const caseOne =
      other.endDateTime > this.startDateTime &&
      other.startDateTime < this.startDateTime;
    const caseTwo =
      other.startDateTime < this.endDateTime &&
      other.endDateTime > this.endDateTime;
    const caseThree =
      other.startDateTime <= this.endDateTime &&
      other.startDateTime >= this.startDateTime &&
      other.endDateTime <= this.endDateTime &&
      other.endDateTime >= this.startDateTime;

    return caseOne || caseTwo || caseThree;
  }

  /**
   * Checks if there exists overlaps between given datetime intervals
   * @param firstBookingIntervals array of DateTimeIntervals
   * @param secondBookingIntervals array of DateTimeIntervals
   * @returns true, if there exists an overlap. Otherwise false.
   */
  public static hasOverlapsBetween(
    firstBookingIntervals: DateTimeInterval[],
    secondBookingIntervals: DateTimeInterval[]
  ) {
    for (let i = 0; i < firstBookingIntervals.length; i++) {
      for (let j = 0; j < secondBookingIntervals.length; j++) {
        const firstBookingInterval = firstBookingIntervals[i];
        const secondBookingInterval = secondBookingIntervals[j];
        if (firstBookingInterval.overlaps(secondBookingInterval)) return true;
      }
    }
    return false;
  }
}

export default DateTimeInterval;
