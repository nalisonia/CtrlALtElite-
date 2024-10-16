// server.js
require('dotenv').config({ path: '../.env' }); // Load environment variables
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const pool = require('./db'); // Import your database connection pool

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Adjust CORS settings as needed
  credentials: true,
}));
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"], // Adjust CSP as needed
    },
  })
);

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' ? true : false },
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const clientRoutes = require('./routes/clientRoutes');
const feedRoutes = require('./routes/feedRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/clients', clientRoutes);
app.use('/feed', feedRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});