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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", loginController);
router.post("/register", registerController);

router.post("/validate", async (req, res, next) => {
  let uid = jwt.verify(req.query.token, process.env.JWT_KEY).sub;
  let user = await User.findByPk(uid);
  if (!user) {
    res
      .status(404)
      .json({ message: "User not found." });
  }
  let emailValidation = await EmailValidation.findByPk(uid);
  if (!emailValidation) {
    res
      .status(404)
      .json({ message: "Error validating email." });
  }
  let now = new Date();
  if (emailValidation.validateBy <= now) {
    res
      .status(403)
      .json({ message: "Validation token expired. Try resending email." });
  }
  emailValidation.validatedAt = now;
  await emailValidation.save();
  res
    .status(200)
    .json({ message: "Email validated." });
});

module.exports = router;
