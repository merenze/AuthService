// controllers/login.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, EmailValidation } = require("../models/");

/**
 * Ensures the email and password field are present in the request body.
 * @param {*} req Request
 * @returns Array of errors
 */
const fieldsPresent = (req) => {
  const errors = [];
  if (req.body.email === undefined) {
    errors.push({ email: "required" });
  }
  if (req.body.password === undefined) {
    errors.push({ password: "required" });
  }
  return errors;
};

/**
 * Ensures the user exists.
 * @param {User} user The user found by the email
 * @returns The passed user
 * @throws Response as { status, body } if the user does not exist.
 */
const userExists = (user) => {
  if (user === null) {
    throw {
      status: 404,
      body: { message: "Invalid email or password." },
    };
  }
  return user;
};

/**
 * Compares the password against the one stored for the user.
 * @param {User} user
 * @param {string} password
 * @returns The passed user
 * @throws Response as { status, body } if the comparison fails.
 */
const comparePassword = async (user, password) => {
  const result = await bcrypt.compare(password, user.passwordHash);
  if (result) {
    return user;
  }
  throw {
    status: 404,
    body: { message: "Invalid email or password." },
  };
};

/**
 * Verifies that the user's email has been validated.
 * @param {User} user
 * @returns The passed user
 * @throws Response as { status, body } if the email is not validated.
 */
const emailValidated = (user) => {
  if (!user.emailValidatedAt) {
    console.debug("Not validated");
    throw {
      status: 403,
      body: { message: "Email address not yet validated." },
    };
  }
  return user;
};

/**
 * Stores the session ID on the user.
 * @param {User} user
 */
const assignSession = (res, user) =>
  res.cookie(
    "session",
    jwt.sign(
      {
        sub: user.id,
      },
      process.env.JWT_KEY
    )
  );

/**
 * Handles a client error.
 * @param {*} res
 * @param {number} status
 * @param {*} body
 */
const handleClientError = (res, status, body) => {
  console.debug(status);
  res.status(status).json(body);
};
/**
 * Handles an internal error.
 * @param {*} res
 * @param {*} error
 */
const handleServerError = (res, error) => {
  console.error("Login failed:", error);
  res.status(500).json({
    message: process.env.NODE_ENV === "development" ? error : "Internal error",
  });
};

/**
 * The login controller action.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async (req, res, next) => {
  let errors = fieldsPresent(req);
  if (errors.length) {
    res.status(400).json({
      message: "Invalid request",
      errors: errors,
    });
  }

  User.findOne({
    where: {
      email: req.body.email,
    }
  })
    .then((user) => userExists(user))
    .then((user) => comparePassword(user, req.body.password))
    .then((user) => emailValidated(user))
    .then((user) => assignSession(res, user))
    .catch(({ status, body }) => handleClientError(res, status, body))
    .catch((error) => handleServerError(res, error));
};