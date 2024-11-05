import React, { useState, useCallback, useEffect } from 'react';
import AWS from 'aws-sdk';
import Cropper from 'react-easy-crop';
import "../Styles/GalleryManager.css";
import { Dialog, DialogActions, DialogContent, Button } from '@mui/material'; // Import Material-UI components
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit'; // Import the Edit icon


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

function GalleryManager() {
  // State variables
  const [file, setFile] = useState(null); // Selected file
  const [imageSrc, setImageSrc] = useState(null); // Image source for cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop coordinates
  const [zoom, setZoom] = useState(1); // Zoom level for the cropper
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Cropped area in pixels
  const [images, setImages] = useState([]); // List of images
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode toggle
  const [open, setOpen] = useState(false); // Dialog state
  const fileInputRef = React.createRef(); // Reference for file input

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });
  const s3 = new AWS.S3({
    params: { Bucket: 'manpreetgallery' },
  });

  // Fetch images from S3 when the component loads
  useEffect(() => {
    loadImages();
  }, []);

  // Function to load all images from S3
  const loadImages = () => {
    const params = { Bucket: 'manpreetgallery' };
    s3.listObjects(params, (err, data) => {
      if (err) {
        console.error('Error fetching images:', err);
        return;
      }
      const imageKeys = data.Contents.map((item) => item.Key);
      const imageUrls = imageKeys.map((key) => s3.getSignedUrl('getObject', { Bucket: 'manpreetgallery', Key: key }));
      setImages(imageUrls);
    });
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
    setCroppedAreaPixels(croppedAreaPixels); // Store the pixel coordinates of the cropped area
  }, []);

  // Function to upload the cropped image to S3
  const handleUpload = async () => {
    if (!file) return alert('Please choose a file to upload!'); 
    try {
      // Get the cropped image and convert it to a blob
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedBlob = await fetch(croppedImage).then((res) => res.blob());

      const params = {
        Body: croppedBlob,
        Bucket: 'manpreetgallery',
        Key: file.name,
      };

      // Upload the file to S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading file:', err);
          return;
        }
        console.log('File uploaded successfully:', data);
        handleCancel(); // Reset after successful upload
        loadImages(); // Reload images after upload
      });
    } catch (error) {
      console.error('Error uploading cropped image:', error);
    }
  };

  // Function to reset the cropper and close the dialog
  const handleCancel = () => {
    setFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setOpen(false); // Close the dialog
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
  };

  // Function to delete an image from S3
  const handleDelete = (signedUrl) => {
    const fileKey = decodeURIComponent(signedUrl.split('?')[0].split('/').pop()); 
    const params = { Bucket: 'manpreetgallery', Key: fileKey };

    // Attempt to delete the object
    s3.deleteObject(params, (err) => {
      if (err) {
        console.error('Error deleting file:', err.message);
        return;
      }
      console.log('File deleted successfully');
      loadImages(); // Reload images after deletion
    });
  };

  // Toggle between edit and normal mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="Gallery-Manager">

      {/* Popup Dialog for cropping */}
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogContent>
          <div className="crop-container" style={{ width: '100%', height: '300px' }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Cancel</Button>
          <Button onClick={handleUpload} color="primary">Upload</Button>
        </DialogActions>
      </Dialog>

<div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
  <h3 style={{ margin: 0 }}>Gallery</h3>

  <div class="buttonContainer" style={{ position: 'absolute', right: 0 }}>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      ref={fileInputRef}
      id="fileInput"
      className="file-input"
      style={{ display: 'none' }} // Hide the default file input
    />
    <Button
      variant="contained"
      component="span"
      startIcon={<CloudUploadIcon />}
      className="upload-button"
      onClick={() => fileInputRef.current.click()} // Trigger file selection
      sx={{
        backgroundColor: '#ffc5fc',
        color: 'black',
        padding: '10px',
        width: "170px",
        marginRight: '20px',  // Add right margin to separate the buttons
        borderRadius: '5px',
        '&:hover': {
          backgroundColor: '#eae1e3',
        },
      }}
    >
      Upload Image
    </Button>

    <Button
      variant="contained"
      component="span"
      startIcon={<EditIcon />}
      onClick={toggleEditMode} // Trigger the toggle function
      sx={{
        backgroundColor: '#ffc5fc',
        color: 'black',
        padding: '10px',
        width: "170px",
        borderRadius: '5px',
        '&:hover': {
          backgroundColor: '#eae1e3',
        },
      }}
    >
      {isEditMode ? 'Done' : 'Edit'}
    </Button>
  </div>
</div>
      <div className="gallery">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} className="card">
              <img src={url} alt={`Image ${index}`} className="card-img" />
              {isEditMode && (
                <button className="delete-btn" onClick={() => handleDelete(url)}>
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
}

export default GalleryManager;