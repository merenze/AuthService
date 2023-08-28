// middleware/loginMiddleware.js
const bcrypt = require("bcrypt");
const handleServerError = require("../utils/handleServerError");

module.exports = {
  // Validate that the necessary fields are provided in the request body.
  requiredFields: (req, res, next) => {
    const missing = [];
    if (!req.body.email) missing.push("email");
    if (!req.body.password) missing.push("password");
    if (missing.length <= 0) {
      next();
      return;
    }
    res.status(400).json({
      message: "Missing required fields.",
      missing: missing,
    });
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
