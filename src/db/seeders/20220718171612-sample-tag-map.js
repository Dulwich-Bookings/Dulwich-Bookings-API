'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('tag_map', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('tag_map', null, {});
  },
};
