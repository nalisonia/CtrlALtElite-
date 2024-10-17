import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, CardHeader, Avatar, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../Styles/UserFeed.css'; // Import CSS file for styling 
import supabase from '../config/supabaseClient.js'; // Import your Supabase client


function UserFeed() {
  const [feedData, setFeedData] = useState([]); // State to store feed data

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        // Fetch all rows from the 'feed_dev' table
        const { data, error } = await supabase
          .from('feed_dev')
          .select('*'); // Select all columns

        if (error) {
          throw error; // Handle any errors from Supabase
        }

        setFeedData(data); // Store the fetched data in state
      } catch (error) {
        console.error(
          'Error fetching feed data:',
          error.message || error
        );
      }
    };

    fetchFeedData(); // Fetch data when the component mounts
  }, []); // Empty dependency array to fetch data once when the component mounts

  return (
    <div className="feed-container">
      <h2>Activity Feed</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
        {feedData.length > 0 ? (
          feedData.map((item) => (
            <Card key={item.id} sx={{ mb: 2, width: '40%', border: '1px solid #ccc' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Admin" // Hardcoded Admin as poster
                subheader={new Date(item.created_at).toLocaleString()}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No feed items found.</Typography>
        )}
      </Box>
    </div>
  );
}

export default UserFeed;
