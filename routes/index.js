// routes/index.js
const express = require("express");
const validator = require("express-validator");
const router = express.Router();
const loginController = require("../controllers/loginController");
const authMiddleware = require("../middleware/authMiddleware");
const registerController = require("../controllers/registerController");
const validateController = require("../controllers/validateController");
const userController = require("../controllers/userController");
const userMiddleware = require("../middleware/userMiddleware");
const { User } = require("../models/");

router.post(
  "/login",
  validator.body("email").trim().notEmpty().withMessage("required"),
  validator.body("password").notEmpty().withMessage("required"),
  authMiddleware.handleInputValidationErrors,
  userMiddleware.findUserByEmail,
  authMiddleware.comparePassword,
  authMiddleware.emailValidated,
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
  authMiddleware.handleInputValidationErrors,
  registerController
);

router.get(
  "/validate",
  validator.body("email").notEmpty().withMessage("required"),
  userMiddleware.findUserByEmail,
  authMiddleware.emailNotValidated,
  validateController.sendEmail
);

router.patch(
  "/validate",
  userMiddleware.findUserByValidateToken,
  authMiddleware.emailNotValidated,
  validateController.validate
);

router.get(
  "/whoami",
  userMiddleware.findUserBySession,
  userController.find
);

module.exports = router;
