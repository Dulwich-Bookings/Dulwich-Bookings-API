'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('bookmarks', [
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
    return await queryInterface.bulkDelete('bookmarks', null, {});
  },
};
