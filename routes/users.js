// controllers/users.js
var express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/:userId", userMiddleware.findUser, userMiddleware.sanitizeUser, userController.find);

module.exports = router;
