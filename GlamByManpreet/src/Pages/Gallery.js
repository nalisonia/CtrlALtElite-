import React from 'react';
import '../Styles/AboutMe.css'; // Import CSS file for styling 
const placeholderImage = "https://via.placeholder.com/300x300?text=First+Picture"; // Placeholder URL for the first picture


function Gallery() {
  return (
    <div className='gallery-container'>
      <h2>Gallery</h2>
      <p>    </p>
      <p>I am a passionate developer who loves coding and building awesome projects.</p>
      <p>This is just a simple example of an Gallery page.</p>
      <div class="card"> 
      <p> This is the first photo  </p>

      <img src={placeholderImage} alt="First Picture" className="first-picture-image" />

      </div>
       
    </div>
    
  );
}

export default Gallery;
