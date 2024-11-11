import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';
import AWS from 'aws-sdk';
import supabase from './../config/supabaseClient.js';


function Feed() {
  const [feedContent, setFeedContent] = useState('');
  const [file, setFile] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [editIndex, setEditIndex] = useState(null); // Track which item is being edited

  // AWS S3 configuration
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const s3 = new AWS.S3({
    params: { Bucket: 'manpreetfeed' },
  });

  // Fetch feed items on component mount
  useEffect(() => {
    fetchFeedItems();
  }, []);

  // Function to fetch feed items from Supabase
  const fetchFeedItems = async () => {
    try {
      const response = await axios.get('https://d8hx0arzv5ybf.cloudfront.net/feed');
      setFeedItems(response.data);
    } catch (error) {
      console.error('Error fetching feed items:', error);
    }
  };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    setFile(selectedFile);
  };

  // Function to upload image to S3
  const handleUploadImage = async () => {
    if (!file) return null; // If no new file, don't upload

    const params = {
      Body: file,
      Bucket: 'manpreetfeed',
      Key: file.name,
    };

    try {
      const upload = await s3.upload(params).promise();
      console.log('Uploaded Image URL:', upload.Location); // Log the uploaded image URL
      return upload.Location; // Return the image URL
    } catch (err) {
      console.error('Error uploading image', err);
      return null;
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    let uploadedImageUrl = await handleUploadImage();

    if (!uploadedImageUrl && !isEditing) {
      return alert('Image upload failed');
    }

   // If editing, use the old image if a new one wasn't uploaded
   const item = {
    content: feedContent,
    image_url: uploadedImageUrl || feedItems[editIndex]?.image_url, // Keep old image if not changed
  };
  
    try {
      if (isEditing) {
        await axios.put( `https://d8hx0arzv5ybf.cloudfront.net/feed/${feedItems[editIndex].id}`, item);
        setIsEditing(false);
        setEditIndex(null);

      } 
      else {
        await axios.post('https://d8hx0arzv5ybf.cloudfront.net/feed/create', item);
      }
      fetchFeedItems(); // Refresh feed
    } catch (error) {
      console.error('Error submitting feed:', error);
    }

    setFeedContent('');
    setFile(null);
  };
  

  // Function to handle editing an item
  const handleEdit = (index) => {
    setFeedContent(feedItems[index].content);
    setEditIndex(index);
    setIsEditing(true);
  };

// Function to handle deleting an item
const handleDelete = async (index) => {
  try {
    await axios.delete(`https://d8hx0arzv5ybf.cloudfront.net/feed/${feedItems[index].id}`);
    fetchFeedItems();
  } catch (error) {
    console.error('Error deleting feed item:', error);
  }
};


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {isEditing ? "Edit Feed Item" : "Create a New Feed Item"}
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
        <input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, backgroundColor: isEditing ? '#ffc5fc' : '#ffc5fc', color: 'black' }}
        >
          {isEditing ? "Save Changes" : "Submit"}
        </Button>
      </Box>

      {/* Display the feed */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 4 }}>
        {feedItems.length > 0 ? (
          feedItems.map((item, index) => (
            <Box key={item.id} sx={{ width: 300, marginBottom: 4 }}>
              {item.image_url ? (
                <img src={item.image_url} alt={`Feed item ${index}`} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              ) : (
                <Typography variant="body2" color="error">Image not available</Typography>
              )}
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                {item.content}
              </Typography>
              <Button variant="contained" onClick={() => handleEdit(index)} sx={{ mt: 1 }}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(index)} sx={{ mt: 1, ml: 1 }}>
                Delete
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No feed items available.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Feed;

