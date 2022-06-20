'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('schools', [
      {
        name: 'Beijing',
        timezone: 'Asia/Shanghai',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Singapore',
        timezone: 'Asia/Singapore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('schools', null, {});
  },
};
