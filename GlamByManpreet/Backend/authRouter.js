// backend/authRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Import the pool from db.js
const session = require('express-session');

const authRouter = express.Router();

// Session middleware
authRouter.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Registration endpoint
authRouter.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUserQuery = 'SELECT * FROM accounts WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO accounts (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [firstName, lastName, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Error during registration' });
    }
});

// Other routes like login, logout, test, etc.
/ Login endpoint
authRouter.post('/logIn', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const query = 'SELECT * FROM accounts WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user.id; // Store user ID in session
        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error during login' });
    }
});

// Logout endpoint
authRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Test route
authRouter.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM accounts LIMIT 1');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Test error:', err);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

module.exports = authRouter;
