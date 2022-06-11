'use strict';

module.exports = {
  async up() {
    return;
  },
  async down(queryInterface) {
    await queryInterface.dropTable('resources');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_resources_bookingRights"'
    );
  },
};
