  const pool = require('../db'); // Assuming you have a db.js file for database connection
  const bcrypt = require('bcrypt'); // For password hashing
  const crypto = require('crypto'); // For generating random tokens (if needed for password reset)
  const { sendEmail } = require('../utils/email'); // Import email utility
  const nodemailer = require('nodemailer'); // For sending emails (if using Nodemailer)

  const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      // 1. Validate input (e.g., check if required fields are present, email format is valid)
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).send('All fields are required');
      }

      // 2. Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Insert the new user into the database
      const result = await pool.query(
        'INSERT INTO accounts (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [firstName, lastName, email, hashedPassword]
      );

      // 4. Send a success response (e.g., with the newly created user ID)
      res.status(201).json({ message: 'User registered successfully', accountId: result.rows[0].id });
    } catch (err) {
      // 5. Handle errors (e.g., duplicate email, database error)
      console.error('Error during registration:', err);
      if (err.code === '23505') { // Unique constraint violation (e.g., duplicate email)
        return res.status(409).send('Email already registered');
      }
      res.status(500).send('Error registering user');
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1. Retrieve the user from the database based on the email
      const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);

      // 2. Check if the user exists
      if (result.rows.length === 0) {
        return res.status(401).send('Invalid email or password');
      }

      const user = result.rows[0];

      // 3. Compare the provided password with the hashed password in the database using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      // 4. If passwords match, create a session (or JWT) and send a success response
      if (isMatch) {
        // ... (session or JWT creation logic - if using sessions) ...
        req.session.userId = user.id; // Assuming you're using express-session
        // ... (or JWT creation logic) ...

        res.status(200).json({ message: 'Login successful', userId: user.id, firstName: user.firstname });
      } else {
        return res.status(401).send('Invalid email or password');
      }
    } catch (err) {
      // 5. Handle errors (e.g., database error)
      console.error('Error during login:', err);
      res.status(500).send('Error during login');
    }
  };

  const forgotPassword = async (req, res) => {
      const { email } = req.body;
    
      try {
        // 1. Check if a user with the provided email exists in the database
        const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(404).send('No user found with that email address');
        }
    
        // 2. If the user exists, generate a unique reset token (e.g., using crypto.randomBytes)
        const token = crypto.randomBytes(20).toString('hex');
    
        // 3. Store the token and its expiration time in the database (you might need to create a separate table for this)
        const tokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
        const updateQuery = `
          UPDATE accounts 
          SET reset_token = $1, reset_token_expiration = $2 
          WHERE email = $3
        `;
        await pool.query(updateQuery, [token, tokenExpiration, email]);
    
        // 4. Send a password reset email to the user containing a link with the token
        // (Using Nodemailer - make sure you have it configured with your email provider)
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
    
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:3000/reset-password?token=${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
    
        await transporter.sendMail(mailOptions);
    
        res.status(200).send('Password reset email sent');
      } catch (err) {
        // 5. Handle errors (e.g., database error, email sending error)
        console.error('Error in forgot-password:', err);
        res.status(500).send('Error sending password reset email');
      }
    };
    
    module.exports = { register, login, forgotPassword };