'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('resources', 'weekProfile', {
      type: Sequelize.ENUM('Weekly', 'BiWeekly'),
      defaultValue: 'Weekly',
      allowNull: false,
    });
  },

  async down(queryInterface) {
    return Promise.all([
      await queryInterface.removeColumn('resources', 'weekProfile'),
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_resources_weekProfile"'
      ),
    ]);
  },
};
