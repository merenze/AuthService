"use strict";

const sequelize = require("../utils/dbConnector");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("emailValidations", {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'users'
        }
      },
      token: {
        type: Sequelize.STRING,
        unique: true,
      },
      lastSent: Sequelize.DATE,
      validateBy: Sequelize.DATE,
      validatedAt: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("emailValidations");
  },
};
