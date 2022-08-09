'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tag', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'schools',
        key: 'id',
      },
      onDelete: 'CASCADE',
      defaultValue: 1,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('tag', 'schoolId');
  },
};
