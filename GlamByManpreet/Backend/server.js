// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Import session middleware
const crypto = require('crypto'); // Import crypto module
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const port = 3000;


// /  / PostgreSQL connection configuration using environment variables from .env file and .env.example file
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret-key',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: process.env.NODE_ENV === 'production' ? true : false },
  cookie: { secure: false }, // Ensure secure is false during development
}));

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true,
}));
app.use(express.json());

// Route to handle password reset
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const query = 'SELECT * FROM accounts WHERE reset_token = $1 AND reset_token_expiration > NOW()';
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE accounts 
      SET password = $1, reset_token = NULL, reset_token_expiration = NULL 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, result.rows[0].id]);

    res.status(200).send('Password has been reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Error resetting password. Please try again.');
  }
});




// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful, current time:', res.rows[0].now);
  }
});


// Route that listens for GET requests from the front end
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
});

// Route to handle writing to the database and sending a response with the inserted data
app.post('/submit', async (req, res) => {
  const {
    firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime,
    eventType, eventName, clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly,
    locationAddress, additionalNotes
  } = req.body;

  try {
    const query = `
      INSERT INTO users (
        firstnameandlastname, phonenumber, emailaddress, eventdate, eventtime,
        eventtype, eventname, clientshairandmakeup, clientshaironly,
        clientsmakeuponly, locationaddress, additionalnotes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    const values = [
      firstNameAndLastName, phoneNumber, emailAddress, eventDate, eventTime,
      eventType, eventName, clientsHairAndMakeup, clientsHairOnly, clientsMakeupOnly,
      locationAddress, additionalNotes
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
      VALUES ($1, $2, $3, $4) RETURNING id;
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


// Login route
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

    // Store user ID in session
    req.session.userId = user.id;

    res.status(200).json({ message: 'Login successful', userId: user.id, firstName: user.firstname });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

// Load environment variables from .env file
require('dotenv').config();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  const query = 'SELECT role FROM accounts WHERE id = $1';
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking user role');
    }
    if (result.rows[0].role !== 'admin') {
      return res.status(403).send('Unauthorized');
    }
    next();
  });
}

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  const query = 'SELECT role FROM accounts WHERE id = $1';
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking user role');
    }
    if (result.rows[0].role !== 'manager') {
      return res.status(403).send('Unauthorized');
    }
    next();
  });
}


// Middleware to check if user is a client
const isClient = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  const query = 'SELECT role FROM accounts WHERE id = $1';
  const values = [req.session.userId];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking user role');
    }
    if (result.rows[0].role !== 'client') {
      return res.status(403).send('Unauthorized');
    }
    next();
  });
}
// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
};


// Route for requesting a password reset link
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const query = 'SELECT * FROM accounts WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).send('No user found with that email address');
    }

    const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
    const tokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Store the token and expiration in the database
    const updateQuery = `
      UPDATE accounts 
      SET reset_token = $1, reset_token_expiration = $2 
      WHERE email = $3
    `;
    await pool.query(updateQuery, [token, tokenExpiration, email]);

    // Send the email with the reset link (Nodemailer configuration)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${token}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Password reset link sent to your email');
  } catch (err) {
    console.error('Error in forgot-password:', err);
    res.status(500).send('Error sending password reset email');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
