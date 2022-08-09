'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      link: {
        allowNull: true,
        type: Sequelize.STRING,
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
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'resources',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      startDateTime: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      endDateTime: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bookingState: {
        allowNull: false,
        type: Sequelize.ENUM('Approved', 'Pending'),
      },
      bookingType: {
        allowNull: false,
        type: Sequelize.ENUM('Booking', 'Lesson'),
      },
      RRULE: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('resource_bookings');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_resource_bookings_bookingState"'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_resource_bookings_bookingType"'
    );
  },
};
