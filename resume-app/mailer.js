const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendWelcomeEmail(to) {
  await transporter.sendMail({
    from: `"Resume App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to Resume App!',
    text: 'Thank you for registering.'
  });
}

module.exports = sendWelcomeEmail;
