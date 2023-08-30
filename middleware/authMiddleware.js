// middleware/authMiddleware.js
const bcrypt = require("bcrypt");
const handleServerError = require("../utils/handleServerError");
const validator = require("express-validator");

module.exports = {
  /**
   * Return a fail response if the input wasn't valid.
   * The failure response message is structured as follows:
   * {
   *   query: {
   *     field1: [ "errormsg1", ... ],
   *     field2: [ "errormsg1", ... ],
   *   },
   *   body: {
   *     field1: [ "errormsg1", ... ],
   *     field2: [ "errormsg1", ... ],
   *   },
   *   ...
   * }
   */
  handleInputValidationErrors: (req, res, next) => {
    // Get the result of the validations
    const result = validator.validationResult(req);
    // Empty result means no errors
    if (result.isEmpty()) {
      return next();
    }
    const errors = {};
    // Build the error message
    result.array().forEach((error) => {
      // If there is not already a key for the error's location, create one.
      // error.location is where the error lives (query, body, etc.).
      if (!errors[error.location]) {
        errors[error.location] = {};
      }
      // If there is not already a key for the error, create one.
      // error.path is the name of the field throwing the error.
      if (!errors[error.location][error.path]) {
        errors[error.location][error.path] = [];
      }
      // Push the error to the array
      errors[error.location][error.path].push(error.msg);
    });
    res
      .status(400)
      .json({ message: "Error validating request.", errors: errors });
  },

  /** Validate that the user's email is validated */
  emailValidated: (req, res, next) => {
    // TODO EV to determine whether unvalidated users can log in
    if (req.user.emailValidatedAt) {
      next();
      return;
    }
    res.status(403).json({ message: "Email address not yet validated." });
  },

  /** Validate that the user's email is NOT validated */
  emailNotValidated: (req, res, next) => {
    if (!req.user.emailValidatedAt) {
      next();
      return;
    }
    res.status(403).json({ message: "Email address already validated." });
  },

  /** Compare the password in the request body to the user's password. */
  comparePassword: async (req, res, next) =>
    bcrypt
      .compare(req.body.password, req.user.passwordHash)
      .then((result) => {
        if (result) {
          next();
          return;
        }
        res.status(401).json({ message: "Email or password incorrect." });
      })
      .catch((error) => handleServerError(error, res)),
};
