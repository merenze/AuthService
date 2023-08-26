// controllers/validateController.js
const jwt = require("jsonwebtoken");
const { User } = require("../models/");

/**
 * Verify that the user exists.
 * // TODO Do this in middleware?
 * @param {User} user User to check
 * @returns 
 */
const userExists = (user) => {
  if (user) {
    console.log('user found')
    return user;
  }
  throw {
    status: 404,
    body: { message: "User not found." },
  };
};

/**
 * Save the validation time to the user.
 * @param {User} user 
 * @returns {Promise<User>} Promise which resolves to the user that was saved.
 */
const validate = async (user) => {
  user.emailValidatedAt = new Date();
  return user.save();
};

/**
 * Send success message to client.
 * @param {*} res The response object
 */
const handleSuccess = (res) => {
  res.status(200).json({ message: "Email validated." });
};

/**
 * Handle a client error.
 * @param {number} status HTTP status code
 * @param {*} body The response body to be returned
 * @param {*} res The response object
 */
const handleClientError = (status, body, res) => {
  console.log(body);
  console.error("Client error: ", body);
  res.status(status).json(body);
};

/**
 * Handle a client error.
 * @param {*} error The error caught
 * @param {*} res The response object
 */
const handleServerError = (error, res) => {
  console.error("Server error:", error);
  res.status(500).json({
    message: process.env.NODE_ENV === "development" ? error.message : "Internal error.",
  });
};

module.exports = async (req, res, next) => {
  let uid = jwt.verify(req.query.token, process.env.JWT_KEY).sub;
  User.findByPk(uid)
    .then(userExists)
    .then(validate)
    .then(() => handleSuccess(res))
    .catch(({ status, body }) => handleClientError(status, body, res))
    .catch((error) => handleServerError(error, res));
};
