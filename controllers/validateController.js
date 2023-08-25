// controllers/validateController.js
const { DataTypes } = require("sequelize");
const { User } = require("../models/");

const userExists = (user) => {
  if (user) {
    return user;
  }
  throw {
    status: 404,
    body: { message: "User not found." },
  };
};

const validate = (user) => {
  user.emailValidation = new Date();
  return user.save();
};

const handleSuccess = (res) => {
  res.status(200).json({ message: "Email validated." });
};

const handleClientError = (status, body, res) => {
  res.status(status).json(body);
};

const handleServerError = (error) => {
  console.error(error);
  response.status(500).json({
    message: process.env.NODE_ENV === "development" ? error : "Internal error.",
  });
};

module.exports = async (req, res, next) => {
  let uid = jwt.verify(req.query.token, process.env.JWT_KEY).sub;
  User.findByPk(uid)
    .then(userExists)
    .then(validate)
    .then(() => handleSuccess(req))
    .catch(({ status, body }) => handleClientError(status, body, res))
    .catch(handleServerError);
};
