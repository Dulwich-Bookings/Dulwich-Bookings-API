'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'schools',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.changeColumn('resources', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'schools',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.changeColumn('subscriptions', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'schools',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('resources', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('subscriptions', 'schoolId', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },
};
