'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('recently_visited', {
      fields: ['userId', 'resourceId'],
      type: 'unique',
      name: 'unique_recently_visited_resource',
    });

    await queryInterface.addConstraint('recently_visited', {
      fields: ['userId', 'subscriptionId'],
      type: 'unique',
      name: 'unique_recently_visited_subscription',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'recently_visited',
      'unique_recently_visited_resource'
    );
    await queryInterface.removeConstraint(
      'recently_visited',
      'unique_recently_visited_subscription'
    );
  },
};
