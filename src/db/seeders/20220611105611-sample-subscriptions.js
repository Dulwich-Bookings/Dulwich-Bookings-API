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
        expiry: '2025-05-03T00:00:00.000Z',
        remindMe: true,
        schoolId: 1,
        link: 'https://www.google.com',
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
        link: 'https://www.google.com',
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
        schoolId: 2,
        link: 'https://www.google.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('subscriptions', null, {});
  },
};
