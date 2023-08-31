// controllers/validateController.js
const jwt = require("jsonwebtoken");
const config = require("../config/");
const handleServerError = require("../utils/handleServerError");
const sendMail = require("../utils/mailTransporter");

module.exports = {
  /** Send the validation email to the user attached to the request. */
  sendEmail: async (req, res) => {
    const options =
      config.emailValidateExpirationHours !== undefined
        ? { expiresIn: config.emailValidateExpirationHours * 3600 }
        : undefined;
    const token = jwt.sign(
      {
        sub: req.user.id,
        purpose: "validateEmail",
      },
      config.jwtKey,
      options
    );
    const validateUrl = `${config.url}/validate?token=${token}`;
    // TODO replace with a mailer service
    sendMail({
      to: req.user.email,
      // TODO should this subject be an EV, or otherwise configurable?
      subject: "Validate your address",
      // TODO give more info than just the link-- probably use a view as a template.
      text: validateUrl,
    });
    res.status(204).send();
  },

  validate: async (req, res) => {
    req.user
      .update({ emailValidatedAt: new Date() })
      .then((user) => res.status(204).send())
      .catch((error) =>
        handleServerError(
          error,
          res,
          "An error ocurred while attempting to save the user."
        )
      );
  },
};
