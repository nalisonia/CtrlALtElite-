import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import '../Styles/Gallery.css'; // Import CSS file for styling

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});
const s3 = new AWS.S3();
const bucketName = 'manpreetgallery'; // Replace with your bucket name

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch the list of images from the S3 bucket
    const fetchImages = async () => {
      const params = {
        Bucket: bucketName,
      };

      try {
        const data = await s3.listObjectsV2(params).promise();
        const imageUrls = data.Contents.map((item) => {
          return `https://${bucketName}.s3.${AWS.config.region}.amazonaws.com/${item.Key}`;
        });
        setImages(imageUrls);
      } catch (err) {
        console.error('Error fetching images from S3:', err);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>      
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} className="Gallery-card">
              <img src={url} alt={`Gallery Item ${index + 1}`} className="gallery-image" />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
}

export default Gallery;
