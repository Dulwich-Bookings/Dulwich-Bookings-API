'use strict';

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('subscriptions', []);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('subscriptions', null, {});
  },
};
