// controllers/login.js
const jwt = require("jsonwebtoken");

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
      "Client-Session",
      jwt.sign(
        {
          sub: req.user.id,
          purpose: "client-session",
          // TODO: EV timeout period
        },
        process.env.JWT_KEY
      )
    )
    .send();
