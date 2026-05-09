const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Jaipur Tourism Portal" <no-reply@jaipurtourism.com>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
