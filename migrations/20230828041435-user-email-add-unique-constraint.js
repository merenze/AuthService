'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint("users", {
      fields: [ "email" ],
      type: "unique",
    })
  },

  down: async (queryInterface, Sequelize) => {
    // no reason to drop the constraint when rolling back
  }
};
