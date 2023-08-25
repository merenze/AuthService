// middleware/userMiddleware.js
const { User } = require("../models/");

module.exports = {
  userExists: async (req, res, next) =>
    User.findByPk(req.params.userId).then((user) => {
      if (user) {
        console.debug("User found.");
        req.user = user;
          next();
          return;
      }
      res.status(404).send();
    }),
};
