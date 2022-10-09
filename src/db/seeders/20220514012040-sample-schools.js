'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('schools', [
      {
        name: 'Beijing',
        timezone: 'Asia/Shanghai',
        alternativeName: '北京德威英国国际学校',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('schools', null, {});
  },
};
