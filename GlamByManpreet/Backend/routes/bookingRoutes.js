const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Submit a booking inquiry
router.post('/submit', bookingController.submitInquiry);

// Get all bookings
router.get('/', bookingController.getBookings);

// Update a booking by ID
router.put('/:id', bookingController.updateBooking);

// Delete a booking by ID
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;