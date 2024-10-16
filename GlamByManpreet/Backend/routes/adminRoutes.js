const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Protect all admin routes with the isAdmin middleware
router.use(isAdmin);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get a user by ID
router.get('/users/:id', adminController.getUserById);

// Update a user by ID
router.put('/users/:id', adminController.updateUser);

// Delete a user by ID
router.delete('/users/:id', adminController.deleteUser);

// Get all bookings
router.get('/bookings', adminController.getAllBookings);

// Update a booking's status (e.g., approve or decline)
router.put('/bookings/:id/status', adminController.updateBookingStatus);

// Route to handle approval or decline of an inquiry
router.post('/inquiry-status', adminController.updateInquiryStatus); 

// Route to approve a client
router.put('/clients/approve/:id', adminController.approveClient); 

// Route to decline a client
router.put('/clients/decline/:id', adminController.declineClient); 

// Route to delete users
router.delete('/users', adminController.deleteUsers); 

module.exports = router;