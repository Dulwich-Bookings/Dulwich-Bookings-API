'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('resource_map', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('resource_map', null, {});
  },
};
