'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('milestones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      schoolId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'schools',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      weekBeginning: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      week: {
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
    await queryInterface.addConstraint('milestones', {
      fields: ['schoolId', 'weekBeginning'],
      type: 'unique',
      name: 'unique_milestones',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint('milestones', 'unique_milestones');
    await queryInterface.dropTable('milestones');
  },
};
