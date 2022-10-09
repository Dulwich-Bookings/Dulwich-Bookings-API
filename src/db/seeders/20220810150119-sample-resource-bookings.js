'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_bookings', []);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_bookings', null, {});
  },
};
