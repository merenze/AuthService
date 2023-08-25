// routes/index.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailValidation = require("../models/emailValidation");
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const User = require("../models/User");
const sendMail = require("../utils/mailTransporter");
const validateController = require("../controllers/validateController");
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/validate", validateController);

module.exports = router;
