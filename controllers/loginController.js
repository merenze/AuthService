// controllers/login.js
const jwt = require("jsonwebtoken");
const config = require("../config/");

/**
 * The login controller action.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res) => {
  const options = config.sessionExpirationHours !== undefined
    ? { expiresIn: config.sessionExpirationHours * 3600 }
    : undefined;
  res
    .status(200)
    .json({
      session: jwt.sign(
        {
          sub: req.user.id,
          purpose: "sessionId",
        },
        config.jwtKey,
        options
      ),
    });
};
