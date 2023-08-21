// utils/mailTransporter.js
const nodemailer = require("nodemailer");

let transporter;

// TODO Enable SMTP transport
transporter = nodemailer.createTransport({
  jsonTransport: true,
});

sendMail = (mailOptions) => {
  transporter.sendMail(
    {
      from: process.env.MAIL_FROM,
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

module.exports = sendMail;
