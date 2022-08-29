'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_booking_events', [
      {
        resourceBookingId: 1,
        startDateTime: '2020-05-03T17:00:00.000Z',
        endDateTime: '2020-05-03T19:00:00.000Z',
        RRULE: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resourceBookingId: 2,
        startDateTime: '2020-05-04T07:00:00.000Z',
        endDateTime: '2020-05-04T09:00:00.000Z',
        RRULE: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resourceBookingId: 3,
        startDateTime: '2020-05-05T17:00:00.000Z',
        endDateTime: '2020-05-05T19:00:00.000Z',
        RRULE: 'DTSTART:20200505T170000Z\nRRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resourceBookingId: 4,
        startDateTime: '2020-05-06T07:00:00.000Z',
        endDateTime: '2020-05-06T09:00:00.000Z',
        RRULE:
          'DTSTART:20200506T070000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20200520T160000Z',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_booking_events', null, {});
  },
};
