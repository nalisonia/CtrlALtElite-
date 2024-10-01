const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Import express-session
const bodyParser = require('body-parser');
// Import Mailgun
const mailgun = require('mailgun-js');

const app = express();
const port = 3000;

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize Mailgun with your API key and domain
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const data = {
    from: 'Your Name <you@yourdomain.com>', // Replace with your sender info
    to: to,
    subject: subject,
    text: text,
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', body);
    }
  });
};

// Example usage
sendEmail('recipient@example.com', 'Hello from Mailgun', 'This is a test email.');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Use CORS middleware

// Session setup
app.use(session({
  secret: 'your-secret-key',   // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // Set 'true' if you're using HTTPS
}));

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful, current time:', res.rows[0].now);
  }
});


// Route to handle forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Generate a password reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Here you should save the token and its expiration to the database
        // Example: Update the user record with the token and expiration date

        // Send email with the password reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use other services like SendGrid, etc.
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const resetLink = `http://localhost:3000/reset-password/${token}`;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email.' });
    }
});

// Route to Reset Password page
app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  // Here you would typically check the token's validity
  // Render a password reset form or send a response indicating success
  res.send(`<form method="POST" action="/reset-password/${token}">
      <input type="password" placeholder="New Password" required />
      <button type="submit">Reset Password</button>
  </form>`);
});

// Route to Handle Password Reset
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
      // Here you would typically verify the token and find the user
      // If valid, hash the new password and update the user's record

      const hashedPassword = await bcrypt.hash(password, 10);
      // Update user's password in the database (this part is dependent on your setup)

      res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error resetting password.' });
  }
});



// Route that listens for get requests from the front end
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
});

// Route to handle writing to the database
app.post('/submit', async (req, res) => {
  const { firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime, eventType, eventName, clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes } = req.body;

  try {
    const query = `
      INSERT INTO users (
        firstnameandlastname, phonenumber, emailaddress, eventdate, eventtime, eventtype, eventname,
        clientshairandmakeup, clientshaironly, clientsmakeuponly, locationaddress, additionalnotes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `;
    
    const values = [
      firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime, eventType, eventName,
      clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly, locationAddress, additionalNotes
    ];

    await pool.query(query, values);
    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});

// Route to delete users
app.delete('/users', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send('Invalid IDs');
  }

  try {
    const query = 'DELETE FROM users WHERE id = ANY($1::int[])';
    await pool.query(query, [ids]);
    res.status(200).send('Users deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting users');
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO accounts (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [firstName, lastName, email, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'User registered successfully', accountId: result.rows[0].id });
  } catch (err) {
    console.error('Error during registration:', err);
    if (err.code === '23505') {
      return res.status(409).send('Email already registered');
    }
    res.status(500).send('Error registering user');
  }
});

// Login route with session handling
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM accounts WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Set session user
    req.session.user = { id: user.id, email: user.email };
    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

// Dashboard route to access protected content
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome, ${req.session.user.email}`);
  } else {
    res.status(401).send('Please login first');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.send('Logged out successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
