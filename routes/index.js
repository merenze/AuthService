// routes/index.js
const express = require("express");
const validator = require("express-validator");
const router = express.Router();
const loginController = require("../controllers/loginController");
const loginMiddleware = require("../middleware/loginMiddleware");
const registerController = require("../controllers/registerController");
const validateController = require("../controllers/validateController");
const userController = require("../controllers/userController");
const userMiddleware = require("../middleware/userMiddleware");
const { User } = require("../models/");

router.post(
  "/login",
  validator.body("email").trim().notEmpty().withMessage("required"),
  validator.body("password").notEmpty().withMessage("required"),
  loginMiddleware.handleInputValidationErrors,
  userMiddleware.findUserByEmail,
  loginMiddleware.comparePassword,
  loginMiddleware.emailValidated,
  loginController
);

router.post(
  "/register",
  validator.body("email").trim().isEmail().withMessage("Invalid email format"),
  validator.body("password").notEmpty().withMessage("required"),
  validator.body("email").custom(async email => {
    if (await User.findByEmail(email)) {
      throw new Error("unique");
    }
  }),
  loginMiddleware.handleInputValidationErrors,
  registerController
);

router.get(
  "/validate",
  validator.body("email").notEmpty().withMessage("required"),
  userMiddleware.findUserByEmail,
  loginMiddleware.emailNotValidated,
  validateController.sendEmail
);

router.patch(
  "/validate",
  userMiddleware.findUserByValidateToken,
  validateController.validate
);

router.get(
  "/whoami",
  userMiddleware.findUserBySession,
  userController.find
);

module.exports = router;
