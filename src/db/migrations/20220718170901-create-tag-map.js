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
        unique: 'uniqueTagMap',
        references: {
          model: 'tag',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      resourceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        unique: 'uniqueTagMap',
        references: {
          model: 'resources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      subscriptionId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        unique: 'uniqueTagMap',
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

    await queryInterface.addConstraint('tag_map', {
      fields: ['tagId', 'resourceId'],
      type: 'unique',
      name: 'unique_tag_map_resource',
    });

    await queryInterface.addConstraint('tag_map', {
      fields: ['tagId', 'subscriptionId'],
      type: 'unique',
      name: 'unique_tag_map_subscription',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint('tag_map', 'unique_tag_map_resource');
    await queryInterface.removeConstraint(
      'tag_map',
      'unique_tag_map_subscription'
    );
    await queryInterface.dropTable('tag_map');
  },
};
