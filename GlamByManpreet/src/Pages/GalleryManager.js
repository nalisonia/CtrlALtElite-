import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';
import AWS from 'aws-sdk';
import { createClient } from '@supabase/supabase-js';
import Cropper from 'react-easy-crop';
import "../Styles/GalleryManager.css"; // Ensure the styles are available

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Add this to your .env file
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Add this to your .env file
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get the cropped image using pixel coordinates
const getCroppedImg = (imageSrc, pixelCrop) => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size to the cropped area's size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped image on the canvas
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Convert the cropped image to a blob and return it as a URL
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    };
    image.src = imageSrc; // Set the source of the image
  });
};

function Feed() {
  const [feedContent, setFeedContent] = useState('');
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false); // Dialog state

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
      const { data, error } = await supabase
        .from('feed')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched feed items:', data); // Log the fetched data
      setFeedItems(data);
    } catch (error) {
      console.error('Error fetching feed items:', error);
    }
  };

  // Function that triggers when an image is selected for upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpen(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Function that executes once cropping is complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to upload the cropped image to S3
  const handleUpload = async () => {
    if (!file) return alert('Please choose a file to upload!');
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedBlob = await fetch(croppedImage).then((res) => res.blob());

      const params = {
        Body: croppedBlob,
        Bucket: 'manpreetfeed',
        Key: file.name,
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.error('Error uploading file:', err);
            reject(err);
            return;
          }
          console.log('File uploaded successfully:', data);
          handleCancel(); // Reset after successful upload
          resolve(data.Location); // Return the uploaded image URL
        });
      });
    } catch (error) {
      console.error('Error uploading cropped image:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log('Submitting feed item...');
    let uploadedImageUrl = await handleUpload();

    if (!uploadedImageUrl && !isEditing) {
      return alert("Image upload failed");
    }

    if (isEditing) {
      // Handle edit submission
      const updatedItem = {
        content: feedContent,
        image_url: uploadedImageUrl || feedItems[editIndex].image_url,
      };

      try {
        await supabase
          .from('feed')
          .update(updatedItem)
          .match({ id: feedItems[editIndex].id });

        const updatedFeedItems = [...feedItems];
        updatedFeedItems[editIndex] = { ...updatedFeedItems[editIndex], ...updatedItem };
        setFeedItems(updatedFeedItems);
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating feed item:', error);
      }
    } else {
      // Handle new submission
      const newItem = {
        content: feedContent,
        image_url: uploadedImageUrl,
      };

      try {
        const { data, error } = await supabase.from('feed').insert(newItem);

        if (error) throw error;

        setFeedItems([...feedItems, { ...newItem, id: data[0].id, created_at: new Date().toISOString() }]);
      } catch (error) {
        console.error('Error submitting feed:', error);
      }
    }

    setFeedContent('');
    setFile(null);
    setImageSrc(null);
  };

  // Reset the cropper and close the dialog
  const handleCancel = () => {
    setFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setOpen(false);
  };

  // Function to handle editing an item
  const handleEdit = (index) => {
    setFeedContent(feedItems[index].content);
    setEditIndex(index);
    setIsEditing(true);
  };

  // Function to handle deleting an item
  const handleDelete = async (index) => {
    const itemToDelete = feedItems[index];
    try {
      await supabase.from('feed').delete().eq('id', itemToDelete.id);
      setFeedItems(feedItems.filter((_, i) => i !== index));
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
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, backgroundColor: isEditing ? '#ffc5fc' : '#ffc5fc', color: 'black' }}
        >
          {isEditing ? "Save Changes" : "Submit"}
        </Button>
      </Box>

      {/* Cropping dialog */}
      {open && (
        <Box>
          <div style={{ width: '100%', height: '300px' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button onClick={handleUpload} color="primary">Upload Cropped Image</Button>
          <Button onClick={handleCancel} color="secondary">Cancel</Button>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Feed Items
      </Typography>
      <Box sx={{ width: '70%', mt: 2 }}>
        {feedItems.map((item, index) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {item.content}
            </Typography>
            {item.image_url && <img src={item.image_url} alt="Feed" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />}
            <Button onClick={() => handleEdit(index)} sx={{ marginRight: 1 }}>Edit</Button>
            <Button onClick={() => handleDelete(index)} color="error">Delete</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Feed;
