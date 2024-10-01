const nodemailer = require('nodemailer');

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',  // or your email provider's SMTP
    port: 2525,
    auth: {
      user: 'your_smtp_user',
      pass: 'your_smtp_pass'
    }
  });

  let info = await transporter.sendMail({
    from: '"Your App" <noreply@yourapp.com>',
    to: "testuser@example.com",
    subject: "Test Email",
    text: "This is a test email."
  });

  console.log("Message sent: %s", info.messageId);
}

sendTestEmail().catch(console.error);
