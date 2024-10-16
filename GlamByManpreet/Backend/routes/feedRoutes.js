const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

// Add a new feed item
router.post('/', feedController.addFeedItem);

// Get all feed items
router.get('/', feedController.getFeedItems);

module.exports = router;