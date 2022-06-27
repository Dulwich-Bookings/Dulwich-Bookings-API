'use strict';

module.exports = {
  async up() {
    return;
  },

  async down(queryInterface) {
    return Promise.all([
      await queryInterface.removeColumn('users', 'schoolId'),
      await queryInterface.removeColumn('resources', 'schoolId'),
      await queryInterface.removeColumn('subscriptions', 'schoolId'),
    ]);
  },
};
