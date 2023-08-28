// routes/index.js
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const loginMiddleware = require("../middleware/loginMiddleware");
const registerController = require("../controllers/registerController");
const validateController = require("../controllers/validateController");
const userController = require("../controllers/userController");
const userMiddleware = require("../middleware/userMiddleware");
const whoamiMiddleware = require("../middleware/whoamiMiddleware");

router.post(
  "/login",
  loginMiddleware.requiredFields,
  userMiddleware.findUserByEmail,
  loginMiddleware.comparePassword,
  loginMiddleware.emailValidated,
  loginController
);

router.post("/register", registerController);
router.post(
  "/validate",
  userMiddleware.findUserByValidateToken,
  validateController
);

router.get(
  "/whoami",
  whoamiMiddleware.sessionProvided,
  whoamiMiddleware.tokenValid,
  whoamiMiddleware.getUserFromSession,
  userController.find
);

module.exports = router;
