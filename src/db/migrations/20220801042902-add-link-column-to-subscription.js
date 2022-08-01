'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('subscriptions', 'link', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('subscriptions', 'link');
  },
};
