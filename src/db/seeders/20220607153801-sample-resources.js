'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resources', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('resources', null, {});
  },
};
