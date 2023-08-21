// routes/mail.js
var express = require("express");
const sendMail = require("../utils/mailTransporter");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  await sendMail({
    to: "john.smith@example.com",
    subject: "Hello World",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });
  res.send({
    message: "Request processed successfully."
  });
});

module.exports = router;
