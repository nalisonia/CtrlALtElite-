const pool = require('../db'); 

const addFeedItem = async (req, res) => {
  const { content } = req.body;

  try {
    const query = 'INSERT INTO feed (content) VALUES ($1)';
    await pool.query(query, [content]);
    res.status(201).send('Feed item added successfully');
  } catch (error) {
    console.error('Error adding feed item:', error);
    res.status(500).send('Error adding feed item');
  }
};

const getFeedItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feed ORDER BY created_at DESC'); // Assuming you have a created_at column
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching feed data:', error);
    res.status(500).send('Error fetching feed data');
  }
};

module.exports = {
  addFeedItem,
  getFeedItems,
};