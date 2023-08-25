// controllers/users.js
var express = require("express");
const { User } = require("../models");
const userMiddleware = require("../middleware/userMiddleware");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/:userId", userMiddleware.userExists, userController.find);

module.exports = router;
