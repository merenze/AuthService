// utils/mailTransporter.js
const nodemailer = require("nodemailer");
const config = require("../config");

// TODO Enable SMTP transport
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

module.exports = (mailOptions) => {
  return transporter.sendMail(
    {
      from: config.mail.from,
      ...mailOptions,
    },
    (error, info) => {
      if (error) {
        console.error("Failed to send email: ", error);
      } else {
        console.log("Email sent: ", info);
      }
    }
  );
};
