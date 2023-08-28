// middleware/loginMiddleware.js
const bcrypt = require("bcrypt");
const handleServerError = require("../utils/handleServerError");
const validator = require("express-validator");

module.exports = {
  /** Return a fail response if the input wasn't validated */
  handleInputValidationErrors: (req, res, next) => {
    const result = validator.validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    const errors = {};
    result.array().forEach((error) => {
      // If there is not already a key for the error, create one
      if (!errors[error.path]) {
        errors[error.path] = [];
      }
      // Push the error to the array
      errors[error.path].push(error.msg);
    });
    res.status(400).json({ errors: errors });
  },

  // Validate that the user's email is validated
  emailValidated: (req, res, next) => {
    // TODO EV to determine whether unvalidated users can log in
    if (req.user.emailValidatedAt) {
      next();
      return;
    }
    res.status(403).json({ message: "Email address not yet validated." });
  },

  // Compare the password in the request body to the user's password.
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
