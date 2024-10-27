require('dotenv').config({ path: '../../.env' });

const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: to,
    });

    console.log('SMS sent:', sms.sid);

  } catch (error) {
    console.error('Error sending SMS:', error);
    // Handle the error appropriately (e.g., log it, retry sending, etc.)
  }
};

module.exports = { sendSMS };