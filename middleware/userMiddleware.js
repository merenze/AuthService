// middleware/userMiddleware.js
const { User } = require("../models/");
const jwt = require("jsonwebtoken");
const config = require("../config/");
const handleServerError = require("../utils/handleServerError");

/**
 * Helper function to return the decoded token, if valid;
 * else, send failure response and return undefined.
 * @param {string} token Token to verify
 * @param {*} res Response object
 * @param {string} expiredMessage Message to send if the token is expired
 * @param {string} [errorMessage] Message to send for internal errors (optional).
 */
const verifyToken = (token, res, expiredMessage, errorMessage) => {
  // Verify the token
  try {
    return jwt.verify(token, config.jwtKey);
  } catch (error) {
    // Handle expired token
    if (error.name === "TokenExpiredError") {
      res.status(401).json(expiredMessage);
      return;
    }
    // Don't bother handling other errors
    handleServerError(error, res, errorMessage);
  }
};

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
    User.findByEmail(req.body.email).then((user) => {
      if (user) {
        req.user = user;
        return next();
      }
      res.status(404).send();
    }),

  /** Get the user (from the Authorization header) and attach it to the request */
  findUserBySession: async (req, res, next) => {
    // Make sure the session is provided
    const signed = req.get("Authorization");
    if (!signed) {
      res
        .status(400)
        .json({ message: "Missing session in Authorization header" });
      return;
    }
    // Verify the token
    const token = verifyToken(
      req.get("Authorization"),
      res,
      "Session expired",
      "Bad session"
    );
    if (!token) return;
    // Get the user
    User.findByPk(token.sub)
      .then((user) => {
        // Should not have to explicitly set, but alas.
        user.isNewRecord = false;
        if (user) {
          // Attach the user to the request
          req.user = user;
          next();
          return;
        }
        // Probably, the token is still valid but the user was deleted.
        res.status(404).json({ message: "No user found for session." });
      })
      .catch((error) => handleServerError(error, res));
  },

  /** Get the user (from an email validation token, provided as a query param) */
  findUserByValidateToken: async (req, res, next) => {
    // Make sure the token is provided
    if (!req.query.token) {
      res.status(400).json({ message: "Missing token in query params" });
      return;
    }
    const token = verifyToken(req.query.token, res, "Validation link expired");
    if (!token) return;
    // Given a valid token, find the user
    User.findByPk(token.sub)
      .then((user) => {
        // Should not have to explicitly set, but alas.
        user.isNewRecord = false;
        // On success, attach the user to the request
        if (user) {
          req.user = user;
          next();
          return;
        }
        // Probably, the token is still valid but the user was deleted.
        res.status(404).send({ message: "No user found for validate link" });
      })
      .catch((error) => handleServerError(error, res));
  },

  /* Remove sensitive data. */
  sanitizeUser: (req, res, next) => {
    req.user.passwordHash = undefined;
    next();
  },
};
