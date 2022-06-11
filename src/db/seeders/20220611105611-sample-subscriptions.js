'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('subscriptions', [
      {
        name: 'Udemy',
        description: 'This is an Udemy subscription.',
        accessRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher']::\"enum_subscriptions_accessRights\"[]"
        ),
        credentials: 'test123',
        expiry: new Date(2023, 6, 1),
        remindMe: true,
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jstor',
        description: 'This is a Jstor subscription.',
        accessRights: Sequelize.literal(
          "ARRAY['Admin', 'Teacher', 'Student']::\"enum_subscriptions_accessRights\"[]"
        ),
        credentials: 'test123',
        expiry: null,
        remindMe: true,
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('subscriptions', null, {});
  },
};
