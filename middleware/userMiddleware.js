// middleware/userMiddleware.js
const { User } = require("../models/");

module.exports = {
  // Get the user from the route param and attach it to the request.
  findUser: async (req, res, next) =>
    User.findByPk(req.params.userId).then((user) => {
      if (user) {
        req.user = user;
        next();
        return;
      }
      res.status(404).send();
    }),

  // Get the user (from an email address provided in the request body) and attach it to the request
  findUserByEmail: async (req, res, next) =>
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        req.user = user;
        next();
        return;
      }
      res.status(404).send();
    }),

  // Remove sensitive data.
  sanitizeUser: (req, res, next) => {
    req.user.passwordHash = undefined;
    next();
  },
};
