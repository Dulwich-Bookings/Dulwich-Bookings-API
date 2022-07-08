'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tag', 'colour', {
      type: Sequelize.STRING,
      defaultValue: '#FFFFFF',
      allowNull: false,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('tag', 'colour');
  },
};
