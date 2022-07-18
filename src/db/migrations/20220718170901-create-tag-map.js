'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tag_map', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tagId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tag',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      resourceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'resources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      subscriptionId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('tag_map');
  },
};
