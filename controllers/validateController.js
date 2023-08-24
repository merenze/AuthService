// controllers/validateController.js
const { User } = require('../models/');

const userExists = (user) => {
  if (user) {
    return user;
  }
  throw {
    status: 404,
    body: { message: "User not found." },
  };
};

const emailValidationExists = (emailValidation) => {
  if (emailValidation) {
    return emailValidation;
  }
  throw {
    // TODO Should this be a different status than userExists?
    // This would help the client differentiate between the errors.
    status: 404,
    body: { message: "No validation token associated with the user." },
  };
};

const notExpired = (emailValidation) => {
  const now = new Date();
  if (now < emailValidation.validateBy) {
      emailValidation.validatedAt = now;
      return emailValidation;
  }
  throw {
    status: 403,
    body: { message: "Token expired." },
  };
};

const handleSuccess = (res) => {
    res
        .status(200)
        .json({ message: 'Email validated.' })
};

const handleClientError = (status, body, res) => {
    res.status(status).json(body);
};

const handleServerError = (error) => {
    console.error(error);
    response.status(500).json({
        message: process.env.NODE_ENV === 'development'
            ? error
            : 'Internal error.'
    })
}

module.exports = async (req, res, next) => {
  let uid = jwt.verify(req.query.token, process.env.JWT_KEY).sub;
    User.findByPk(uid)
        .then(userExists)
        .then((user) => user.getEmailValidation())
        .then(emailValidationExists)
        .then(notExpired)
        .then(emailValidation => emailValidation.save())
        .then(() => handleSuccess(req))
        .catch(({ status, body }) => handleClientError(status, body, res))
        .catch(handleServerError);
};
