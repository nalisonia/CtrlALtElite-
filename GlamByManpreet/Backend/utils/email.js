// utils/email.js
const mailgun = require('mailgun-js');

// Mailgun configuration
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendEmail = async (to, subject, text) => {
  const data = {
    from: 'glambymanpreetinquiries@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const body = await mg.messages().send(data);
    console.log('Email sent:', body);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };