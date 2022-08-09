'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag', [
      {
        name: 'Math',
        colour: '#264653',
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        colour: '#2A9D8F',
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Geography',
        colour: '#E9C46A',
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'History',
        colour: '#F4A261',
        schoolId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Economics',
        colour: '#E76F51',
        schoolId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'SE21',
        colour: '#EAE2B7',
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async queryInterface => {
    return await queryInterface.bulkDelete('tag', null, {});
  },
};
