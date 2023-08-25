"use strict";

const sequelize = require("../utils/dbConnector");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("emailValidations", {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
        },
      },
      lastSent: Sequelize.DATE,
      validateBy: Sequelize.DATE,
      validatedAt: Sequelize.DATE,
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable("emailValidations"),
};
