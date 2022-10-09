'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag', [
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
