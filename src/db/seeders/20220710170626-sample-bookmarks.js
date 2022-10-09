'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('bookmarks', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('bookmarks', null, {});
  },
};
