'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_bookings', [
      {
        userId: 1,
        resourceId: 1,
        description: 'CS1101S tutorial',
        bookingState: 'Pending',
        bookingType: 'Booking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        resourceId: 2,
        description: 'CS2100 lab',
        bookingState: 'Pending',
        bookingType: 'Lesson',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        resourceId: 1,
        description: 'CS2030S lab',
        bookingState: 'Approved',
        bookingType: 'Booking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        resourceId: 2,
        description: 'CS2109S tutorial',
        bookingState: 'Approved',
        bookingType: 'Lesson',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_bookings', null, {});
  },
};
