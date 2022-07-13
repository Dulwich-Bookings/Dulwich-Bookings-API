'use strict';

module.exports = {
  async up() {
    return;
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role"'
    );
  },
};
