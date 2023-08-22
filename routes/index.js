// routes/index.js
// TODO clean this up-- consistent with "consts" and single quotes
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const dbConnector = require("../utils/dbConnector");
const EmailValidation = require("../models/emailValidation");
const User = require("../models/User");
const sendMail = require("../utils/mailTransporter");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Register a user
router.post("/register", async (req, res, next) => {
  let newUser;
  // TODO validate request!
  bcrypt
    .hash(req.body.password, parseInt(process.env.BCRYPT_ROUNDS))
    // Create the user
    .then((hash) => {
      return User.create({
        email: req.body.email,
        passwordHash: hash,
      });
    })
    // Create the EmailValidation
    .then((user) => {
      newUser = user;
      now = new Date();
      validateBy = new Date(now);
      validateBy.setHours(now.getHours() + process.env.EMAIL_VALIDATE_EXPIRATION_HOURS);
      return EmailValidation.create({
        userId: user.id,
        token: jwt.sign(crypto.randomBytes(16).toString('hex'), process.env.JWT_KEY),
        lastSent: now,
        validateBy: validateBy,
      })
    })
    // Send the validation email
    .then((emailValidation) => {
      // TODO AThere has to be a better way of programmatically getting this route.
      validateUrl = `${process.env.APP_URL}/validate?token=${emailValidation.token}`;
      return sendMail({
        to: newUser.email,
        // TODO should this subject be an EV, or otherwise configurable?
        subject: "Validate your address",
        // TODO give more info than just the link-- probably use a view as a template.
        text: `<a href="${validateUrl}">Follow to validate</a>`,
      });
    })
    // Success response
    .then(() => {
      // TODO: Clean up this message
      res.status(201).json({ message: "An email was sent to the registered address. Follow the URL to validate your email address and continue as an authenticated user." });
    })
    // Failure response
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message:
          process.env.NODE_ENV === "development" ? error : "Error saving user.",
      });
    })
});

module.exports = router;
