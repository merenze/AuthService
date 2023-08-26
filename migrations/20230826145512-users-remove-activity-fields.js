"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("users", "lastLogin", {
        transaction: t,
      });
      await queryInterface.removeColumn("users", "lastActivity", {
        transaction: t,
      });
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn("users", "lastLogin", DataTypes.DATE, {
        transaction: t,
      });
      await queryInterface.addColumn("users", "lastActivity", DataTypes.DATE, {
        transaction: t,
      });
    }),
};
