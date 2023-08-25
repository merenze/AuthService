// controllers/registerController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/");

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

/**
 * Sends the validation email to the user.
 * @param {User} user User being registered
 */
const sendEmailValidation = (user) => {
  const now = new Date();
  const exp = new Date(now);
  exp.setHours(now.getHours() + process.env.EMAIL_VALIDATE_EXPIRATION_HOURS);
  const token = jwt.sign({
    sub: user.id,
    exp: exp.getTime(),
  }, process.env.JWT_KEY);
  const validateUrl = `${process.env.APP_URL}/validate?token=${token}`;
  return sendMail({
    to: user.email,
    // TODO should this subject be an EV, or otherwise configurable?
    subject: "Validate your address",
    // TODO give more info than just the link-- probably use a view as a template.
    text: `<a href="${validateUrl}">Follow to validate</a>`,
  });
};

/**
 * Indicates success to the client.
 */
const sendSuccessResponse = (res) => {
  // TODO: Clean up this message
  res.status(201).json({
    message:
      "An email was sent to the registered address. Follow the URL to validate your email address and continue as an authenticated user.",
  });
};

/**
 * Handles an internal error.
 * @param {*} error
 * @param {*} res
 */
const handleServerError = (error, res) => {
  console.error(error);
  res.status(500).json({
    message: process.env.NODE_ENV === "development" ? error.message : "Internal error",
  });
};

module.exports = async (req, res, next) => {
  // TODO validate request!
  bcrypt
    .hash(req.body.password, parseInt(process.env.BCRYPT_ROUNDS))
    .then((hash) => createUser(req, hash))
    .then(sendEmailValidation)
    .then(() => sendSuccessResponse(res))
    .catch((error) => handleServerError(error, res));
};
