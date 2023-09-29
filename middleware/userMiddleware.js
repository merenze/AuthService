// middleware/userMiddleware.js
const { User } = require("../models/");
const jwt = require("jsonwebtoken");
const config = require("../config/");
const handleServerError = require("../utils/handleServerError");

/** Maps token purpose to expiration message */
const tokenExpiredErrorMessage = {
  validateEmail: "Validation link expired",
  resetPassword: "Password reset link expired",
  sessionId: "Session expired",
};

/**
 * Helper function to return the decoded token, if valid;
 * else, send failure response and return false.
 * @param {string} token Token to verify
 * @param {*} res Response object
 * @param {"validateEmail"|"resetPassword"|"sessionId"} purpose Attempted use of token (mismatch with decoded token's purpose results in 403).
 * @param {string} [errorMessage] Message to send for internal errors (optional).
 * @return {*} Decoded token, if the token passes verification; else false.
 */
const verifyToken = (token, res, purpose, errorMessage) => {
  let verified;
  // Verify the token
  try {
    verified = jwt.verify(token, config.jwtKey);
  } catch (error) {
    // Handle expired token
    if (error.name === "TokenExpiredError") {
      console.debug("expired");
      res.status(401).json({ message: tokenExpiredErrorMessage[purpose] });
      return false;
    }
    // Don't bother handling other errors
    res.status(403).json({ message: "invalid token" });
    return false;
  }
  // Verify purpose
  if (verified.purpose !== purpose) {
    res.status(403).json({
      message: `Provided token purpose '${verified.purpose}' not valid for this route.`,
    });
    return false;
  }
  return verified;
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
        req.logger.debug(`Found user: ${user.email}`);
        req.user = user;
        return next();
      }
      res.status(404).send();
    }),

  /** Get the user (from the Authorization header) and attach it to the request */
  findUserBySession: async (req, res, next) => {
    // Verify presence of header
    const auth = req.get("Authorization");
    if (!auth) {
      return res.status(403).json({
        message: "Authorization header required for this route",
      });
    }
    // Validate the header
    const [scheme, credentials] = auth.split(" ");
    if (scheme !== "Bearer") {
      return res.status(403).json({
        message: `Authorization scheme '${scheme}' not accepted by this route`,
      });
    }
    if (!credentials) {
      return res.status(403).json({
        message: `Missing credentials in Authorization header`,
      });
    }
    // Verify the token
    const token = verifyToken(credentials, res, "sessionId");
    if (!token) {
      return;
    }
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

  /** Get the user (from an email validation token, provided as a query param) and attach it to the request object. */
  findUserByValidateToken: async (req, res, next) => {
    // Existence of token should be validated by authMiddleware.tokenExists
    const token = verifyToken(req.query.token, res, "validateEmail");
    if (!token) {
      return;
    }
    // Given a valid token, find the user
    User.findByPk(token.sub)
      .then((user) => {
        // On success, attach the user to the request
        if (user) {
          // Should not have to explicitly set, but alas.
          user.isNewRecord = false;
          req.user = user;
          return next();
        }
        // Probably, the token is still valid but the user was deleted.
        res.status(404).send({ message: "No user found for validate link" });
      })
      .catch((error) => handleServerError(error, res));
  },

  /** Get the user (from a password reset token, provided as a query param) and attach it to the request. */
  findUserByResetToken: async (req, res, next) => {
    const token = verifyToken(req.query.token, res, "resetPassword");
    if (!token) {
      return;
    }
    User.findByPk(token.sub)
      .then((user) => {
        if (user) {
          // Again, set explictly
          user.isNewRecord = false;
          req.user = user;
          return next();
        }
        // Probably, the token is still valid but the user was deleted.
        res.status(404).send({ message: "No user found for reset link" });
      })
      .catch((error) => handleServerError(error, res));
    next();
  },

  /* Remove sensitive data. */
  sanitizeUser: (req, res, next) => {
    req.user.passwordHash = undefined;
    next();
  },
};
