'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('resources', [
      {
        name: 'A113',
        description: 'This is an intriguing room.',
        accessRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher']::\"enum_resources_accessRights\"[]"
        ),
        bookingRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher']::\"enum_resources_bookingRights\"[]"
        ),
        inAdvance: 3,
        isBookingDescriptionOptional: true,
        schoolId: 1,
        weekProfile: 'BiWeekly',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'B113',
        description: 'This is a boring room.',
        accessRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher', 'Student']::\"enum_resources_accessRights\"[]"
        ),
        bookingRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher', 'Student']::\"enum_resources_bookingRights\"[]"
        ),
        inAdvance: 4,
        isBookingDescriptionOptional: false,
        schoolId: 1,
        weekProfile: 'Weekly',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('resources', null, {});
  },
};
