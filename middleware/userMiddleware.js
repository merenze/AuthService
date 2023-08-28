// middleware/userMiddleware.js
const { User } = require("../models/");
const jwt = require("jsonwebtoken");
const config = require("../config/");
const { default: axios } = require("axios");

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
    try {
      token = jwt.decode(req.query.token);
    } catch (error) {
      // Handle expired token
      if (error.name === "TokenExpiredError") {
        res.status(401).json("Validation link expired.");
        return;
      }
      // Don't bother handling other errors
      console.error(error.name, error.message);
      res.status(500).json("Internal error.");
      return;
    }
    await axios.get(
      `${config.url}/users/${token.sub}`
    )
      .then((response) => {
        // On success, attach the user to the request
        if (response.status === 200) {
          req.user = new User(response.data);
          next();
          return;
        }
        // On failure, send the client whatever response was received.
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message })
      });
  },

  /* Remove sensitive data. */
  sanitizeUser: (req, res, next) => {
    req.user.passwordHash = undefined;
    next();
  },
};
