'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_booking_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resourceBookingId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'resource_bookings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startDateTime: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      endDateTime: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('resource_booking_events');
  },
};
