'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_map', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
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

    await queryInterface.addConstraint('resource_map', {
      fields: ['userId', 'resourceId'],
      type: 'unique',
      name: 'unique_resource_map_resource',
    });

    await queryInterface.addConstraint('resource_map', {
      fields: ['userId', 'subscriptionId'],
      type: 'unique',
      name: 'unique_resource_map_subscription',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'resource_map',
      'unique_resource_map_resource'
    );
    await queryInterface.removeConstraint(
      'resource_map',
      'unique_resource_map_subscription'
    );
    await queryInterface.dropTable('resource_map');
  },
};
