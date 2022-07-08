'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag', [
      {
        name: 'Math',
        colour: '#264653',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        colour: '#2A9D8F',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Geography',
        colour: '#E9C46A',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'History',
        colour: '#F4A261',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Economics',
        colour: '#E76F51',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'SE21',
        colour: '#EAE2B7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('tag', null, {});
  },
};
