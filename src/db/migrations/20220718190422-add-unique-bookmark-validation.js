'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('bookmarks', {
      fields: ['userId', 'resourceId'],
      type: 'unique',
      name: 'unique_bookmarks_resource',
    });

    await queryInterface.addConstraint('bookmarks', {
      fields: ['userId', 'subscriptionId'],
      type: 'unique',
      name: 'unique_bookmarks_subscription',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'bookmarks',
      'unique_bookmarks_resource'
    );
    await queryInterface.removeConstraint(
      'bookmarks',
      'unique_bookmarks_subscription'
    );
  },
};
