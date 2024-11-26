// middleware/auth.js

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) { 
      // Assuming you're using express-session for session management
      // If the user is logged in, proceed to the next middleware or route handler
      next();
    } else {
      // If the user is not logged in, send an unauthorized (401) response
      res.status(401).send('Unauthorized');
    }
  };
  
  // Middleware to check if the user is an admin
  const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId) {
      // 1. Retrieve the user's role from the database based on their ID
      // (You'll need to adjust the query and table/column names based on your database schema)
      pool.query('SELECT * FROM admin WHERE id = $1', [req.session.userId], (err, result) => {
        if (err) {
          console.error('Error checking user role:', err);
          return res.status(500).send('Error checking user role');
        }
  
        if (result.rows.length > 0) {
          // 2. If the user has the 'admin' role, proceed to the next middleware or route handler
          next();
        } else {
          // 3. If the user is not an admin, send an unauthorized (403) response
          res.status(403).send('Forbidden - Admin access required');
        }
      });
    } else {
      // If the user is not logged in, send an unauthorized (401) response
      res.status(401).send('Unauthorized');
    }
  };
  
  module.exports = { isAuthenticated, isAdmin };