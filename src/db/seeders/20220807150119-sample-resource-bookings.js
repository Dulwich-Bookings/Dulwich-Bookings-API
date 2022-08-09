'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_bookings', [
      {
        link: '6f30b1cc-fde2-49f4-950c-10f769e4f600',
        userId: 1,
        resourceId: 1,
        description: 'CS1101S tutorial',
        startDateTime: '2020-05-03T17:00:00.000Z',
        endDateTime: '2020-05-03T19:00:00.000Z',
        bookingState: 'Pending',
        bookingType: 'Booking',
        RRULE: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        link: 'bf2e3699-8caa-47af-8c00-aed2ff6db242',
        userId: 3,
        resourceId: 2,
        description: 'CS2100 lab',
        startDateTime: '2020-05-04T07:00:00.000Z',
        endDateTime: '2020-05-04T09:00:00.000Z',
        bookingState: 'Pending',
        bookingType: 'Lesson',
        RRULE: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        link: '297d6645-5a39-4e09-b9fd-767cbb9c12e9',
        userId: 1,
        resourceId: 1,
        description: 'CS2030S lab',
        startDateTime: '2020-05-05T17:00:00.000Z',
        endDateTime: '2020-05-05T19:00:00.000Z',
        bookingState: 'Approved',
        bookingType: 'Booking',
        RRULE: 'RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        link: 'f231878f-0dc9-492d-bf4c-dbcabc4dd9d5',
        userId: 1,
        resourceId: 2,
        description: 'CS2109S tutorial',
        startDateTime: '2020-05-06T07:00:00.000Z',
        endDateTime: '2020-05-06T09:00:00.000Z',
        bookingState: 'Approved',
        bookingType: 'Lesson',
        RRULE: 'RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20200520T160000Z',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_bookings', null, {});
  },
};
