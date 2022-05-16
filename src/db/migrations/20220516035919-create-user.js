'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        role: {
          allowNull: false,
          type: Sequelize.ENUM('Admin', 'Student', 'Teacher'),
        },
        schoolId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        isConfirmed: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        },
        isTemporary: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        class: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['email', 'schoolId'],
          },
        ],
      }
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
