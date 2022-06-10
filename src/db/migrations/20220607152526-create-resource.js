'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
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
      bookingRights: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.ENUM('Admin', 'Student', 'Teacher')),
      },
      inAdvance: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      isBookingDescriptionOptional: {
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
    await queryInterface.dropTable('resources');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_resources_accessRights"'
    );
  },
};
