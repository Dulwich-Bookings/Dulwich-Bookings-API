'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      accessRights: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.ENUM('Admin', 'Student', 'Teacher')),
      },
      credentials: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      expiry: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      remindMe: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      schoolId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_subscriptions_accessRights"'
    );
  },
};
