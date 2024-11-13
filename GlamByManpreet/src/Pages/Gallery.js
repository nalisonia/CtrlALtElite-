import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import '../Styles/Gallery.css'; // Import CSS file for styling

// Configure AWS with environment variables
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});
const s3 = new AWS.S3();
const bucketName = 'manpreetgallery';

function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
        console.log(imageUrls);  // Log image URLs
        setImages(imageUrls);
      } catch (err) {
        console.error('Error fetching images from S3:', err);
      }
    };

    fetchImages();
  }, []);

  // Open the modal with the selected image
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} className="Gallery-card">
              <img
                src={url}
                alt={`Gallery Item ${index + 1}`}
                className="gallery-image"
                onClick={() => openModal(url)} // Open modal on image click
              />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Modal for enlarged image */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <img src={selectedImage} alt="Enlarged" className="enlarged-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;