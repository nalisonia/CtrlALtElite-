const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'smtp.example.com' for another email provider
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-app-password' // Your app password
    }
});


// Function to send the reset link
const sendResetLink = (email, resetLink) => {
    const mailOptions = {
        from: 'lyaniro@csus.edu',
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return false; // Indicate failure
        }
        console.log('Email sent:', info.response);
        return true; // Indicate success
    });
};
