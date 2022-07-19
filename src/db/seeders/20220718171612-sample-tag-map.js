'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag_map', [
      {
        tagId: 1,
        resourceId: 1,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 2,
        resourceId: 1,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 3,
        resourceId: 1,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 4,
        resourceId: 2,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 5,
        resourceId: 2,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 6,
        resourceId: 2,
        subscriptionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: 2,
        resourceId: null,
        subscriptionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('tag_map', null, {});
  },
};
