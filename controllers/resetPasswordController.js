// controllers/resetPasswordController.js
const config = require("../config/");
const sendMail = require("../utils/mailTransporter");
const jwt = require("jsonwebtoken");

module.exports = {
  /** Send the password reset email to the user attached to the request. */
  sendResetEmail: (req, res) => {
    req.logger.debug(`Building password reset link for ${req.user.email}`);
    const options =
      config.passwordResetExpirationHours !== undefined
        ? { expiresIn: config.passwordResetExpirationHours * 3600 }
        : undefined;
    const token = jwt.sign(
      {
        sub: req.user.id,
        purpose: "resetPassword",
      },
      config.jwtKey,
      options
    );
    const url = `${config.url}/password-reset?token=${token}`;
    req.logger.debug(`URL: ${url}`);
    sendMail({
      to: req.user.email,
      subject: "Password reset",
      text: url,
    });
    res.status(204).send();
  },

  /** Update the user's password with one provided in the request body. */
  setPassword: (req, res) => {
    // TODO
    res.status(204).send();
  },
};
