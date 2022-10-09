'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_booking_events', []);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_booking_events', null, {});
  },
};
