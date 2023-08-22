// routes/index.js
var express = require("express");
var router = express.Router();
let bcrypt = require("bcrypt");
let dbConnector = require("../utils/dbConnector");
let User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Register a user
router.post("/register", async (req, res, next) => {
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
    // Success response
    .then(() => {
      // TODO: Send validation email
      res.status(201).json({ message: 'User created successfully.' });
    })
    // Failure response
    .catch((error) => {
      res.status(500)
        .json({
          message: process.env.NODE_ENV === 'development' ? error : 'Error saving user.'
        });
    })
});

module.exports = router;
