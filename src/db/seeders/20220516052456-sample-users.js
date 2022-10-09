/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

module.exports = {
  up: async queryInterface => {
    return await queryInterface.bulkInsert('users', [
      {
        email: 'admin@dulwich.org',
        password: hashPassword('asdasd'),
        role: 'Admin',
        schoolId: 1,
        isConfirmed: true,
        isTemporary: false,
        class: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    return await queryInterface.bulkDelete('users', null, {});
  },
};
