// controllers/login.js
const jwt = require("jsonwebtoken");
const config = require("../config/");

/**
 * The login controller action.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res) =>
  res
    .status(200)
    .set(
      "Authorization",
      jwt.sign(
        {
          sub: req.user.id,
          purpose: "sessionId",
        },
        process.env.JWT_KEY,
        { expiresIn: config.sessionExpirationHours }
      )
    )
    .send();
