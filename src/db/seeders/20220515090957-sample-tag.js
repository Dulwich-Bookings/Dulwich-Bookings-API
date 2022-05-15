'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag', [
      {
        name: 'Math',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Geography',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'History',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Economics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'SE21',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('tag', null, {});
  },
};
