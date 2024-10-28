import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Avatar, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createClient } from '@supabase/supabase-js';
import '../Styles/UserFeed.css'; // Import CSS file for styling

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function UserFeed() {
  const [feedData, setFeedData] = useState([]); // State to store feed data

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const { data, error } = await supabase
          .from('feed')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setFeedData(data);
      } catch (error) {
        console.error('Error fetching feed data:', error.message);    
      }
    };
  
    fetchFeedData();
  }, []); // Empty dependency array to fetch data once when the component mounts

  return (
    <div className="feed-container">
      <h2>Activity Feed</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
        {feedData.length > 0 ? (
          feedData.map((item) => (
            <Card key={item.id} sx={{ mb: 2, width: '40%', border: '1px solid #ccc' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>}
                action={
                  <MoreVertIcon />
                }
                title="Admin" // Hardcoded Admin as poster
                subheader={new Date(item.created_at).toLocaleString()}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
                {item.image_url && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img src={item.image_url} alt="Feed" style={{ width: '100%', borderRadius: 8 }} />
                  </Box>
                )}
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
