// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',  // Ensure this is the correct database name
    password: 'Password',  // Replace with your actual password
    port: 5432,
});

// Log the connection status
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connected successfully');
    release();
});

module.exports = pool;
