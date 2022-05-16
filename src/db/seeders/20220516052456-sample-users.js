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
      {
        email: 'teacher@dulwich.org',
        password: hashPassword('asdasd'),
        role: 'Teacher',
        schoolId: 1,
        isConfirmed: true,
        isTemporary: false,
        class: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'student23@stu.dulwich.org',
        password: hashPassword('asdasd'),
        role: 'Student',
        schoolId: 1,
        isConfirmed: true,
        isTemporary: false,
        class: 2023,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'temporary@dulwich.org',
        password: hashPassword('asdasd'),
        role: 'Teacher',
        schoolId: 1,
        isConfirmed: true,
        isTemporary: true,
        class: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'confirmation@dulwich.org',
        password: hashPassword('asdasd'),
        role: 'Teacher',
        schoolId: 1,
        isConfirmed: false,
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
