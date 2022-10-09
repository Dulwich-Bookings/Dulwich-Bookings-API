'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('recently_visited', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('recently_visited', null, {});
  },
};
