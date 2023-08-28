// middleware/userMiddleware.js
const { User } = require("../models/");
const jwt = require("jsonwebtoken");
const config = require("../config/");
const { default: axios } = require("axios");
const handleServerError = require("../utils/handleServerError");

module.exports = {
  /** Get the user from the route param and attach it to the request. */
  findUser: async (req, res, next) =>
    User.findByPk(req.params.userId).then((user) => {
      if (user) {
        req.user = user;
        next();
        return;
      }
      res.status(404).send();
    }),

  /** Get the user (from an email address provided in the request body) and attach it to the request */
  findUserByEmail: async (req, res, next) =>
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        req.user = user;
        next();
        return;
      }
      res.status(404).send();
    }),

  /** Get the user (from an email validation token, provided as a query param) */
  findUserByValidateToken: async (req, res, next) => {
    let token;
    // Verify the token
    try {
      token = jwt.verify(req.query.token, config.jwtKey);
    } catch (error) {
      // Handle expired token
      if (error.name === "TokenExpiredError") {
        res.status(401).json("Validation link expired.");
        return;
      }
      // Don't bother handling other errors
      handleServerError(error, res);
      return;
    }
    // Given a valid token, find the user
    User.findByPk(token.sub)
      .then((user) => {
        user.isNewRecord = false; // Should not have to explicitly set, but alas.
        // On success, attach the user to the request
        if (user) {
          req.user = user;
          next();
          return;
        }
        // Handle failure
        res.status(404).send();
      })
      .catch((error) => handleServerError(error, res));
  },

  /* Remove sensitive data. */
  sanitizeUser: (req, res, next) => {
    req.user.passwordHash = undefined;
    next();
  },
};
