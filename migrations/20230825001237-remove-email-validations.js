"use strict";
const { EmailValidation } = require("../models/");
const createEmailValidationsTable =
  require("./20230822015032-create-emailValidation-table").up;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        "users",
        "emailValidatedAt",
        Sequelize.DATE,
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        `UPDATE users u, emailValidations ev ` +
          `SET u.emailValidatedAt = ev.validatedAt ` +
          `WHERE u.id = ev.userId`,
        { transaction: t }
      );
      await EmailValidation.drop({ transaction: t });
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (t) => {
      await createEmailValidationsTable(queryInterface, Sequelize, {
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `INSERT INTO emailValidations (userId, validatedAt) ` +
          `SELECT id, emailValidatedAt FROM users`,
        { transaction: t }
      );
      await queryInterface.removeColumn("users", "emailValidatedAt", {
        transaction: t,
      });
    }),
};
