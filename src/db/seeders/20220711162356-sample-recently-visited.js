'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('recently_visited', [
      {
        userId: 1,
        resourceId: 1,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        resourceId: null,
        subscriptionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('recently_visited', null, {});
  },
};
