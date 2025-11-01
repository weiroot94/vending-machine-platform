const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport({
    host: 'smtp.strato.de',
    port: 587,
    secure: false,
    auth: {
      user: config.email.username,
      pass: config.email.password
    }
  });

  exports.sendEmail = async (mailOptions) => {
    return transporter.sendMail(mailOptions);
  };