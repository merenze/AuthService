// controllers/registerController.js
const bcrypt = require("bcrypt");
const { User } = require("../models/");
const handleServerError = require("../utils/handleServerError");

/**
 * Create a user with the given data.
 * @param {*} req
 * @param {string} passwordHash
 * @returns The created user
 */
const createUser = (req, passwordHash) =>
  User.create({
    email: req.body.email,
    passwordHash: passwordHash,
  });

module.exports = async (req, res) => {
  // TODO validate request!
  bcrypt
    .hash(req.body.password, parseInt(process.env.BCRYPT_ROUNDS))
    .then((hash) => createUser(req, hash))
    .then(sendEmailValidation)
    .then(() => res.status(201).send())
    .catch((error) => handleServerError(error, res));
};
