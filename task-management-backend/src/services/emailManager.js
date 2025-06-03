const { fromEnv } = require('../utils');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: fromEnv('EMAIL_USER'),
    pass: fromEnv('EMAIL_PASS'),
  },
});

async function sendResetPasswordLink(receiver, resetLink) {
  try {
    const info = await transporter.sendMail({
      from: `"Support Team" <${fromEnv('EMAIL_USER')}>`,
      to: receiver,
      subject: 'Reset Your Password',
      html: `
        <p>You requested to reset your password.</p>
        <p>Please click the link below to reset it:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log('Password reset email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send password reset email.');
  }
}

module.exports = sendResetPasswordLink;
