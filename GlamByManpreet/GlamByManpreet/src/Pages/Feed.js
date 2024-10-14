// Feed.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';

function Feed() {
  const [feedContent, setFeedContent] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/feed', { content: feedContent });
      // Clear the input field after successful submission
      setFeedContent('');
      // We should consider fetching the feed data here or updating the state in AdminDashboard.js
    } catch (error) {
      console.error('Error submitting feed:', error);
    }
  };

  return (
    <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', width: '100%' }}>
            Create a New Feed Item
        </Typography>
        <Box sx={{ width: '70%' }}>
            <TextField
                label="Type something here to share with your clients!"
                multiline
                rows={4}
                fullWidth
                value={feedContent}
                onChange={(e) => setFeedContent(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    </Box>
  );
}

export default Feed;