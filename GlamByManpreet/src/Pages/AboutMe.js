import React from 'react';
import pic1 from '../assets/images/actual_about_me.png';
import '../Styles/AboutMe.css'; // Import CSS file for styling 

function AboutMe() {
  return (
    <div className='about-container'>
      <div className='text-box'>
        <h2>About Me</h2>
        <p>Welcome to my world of beauty in the heart of Sacramento!
           As a makeup artist specializing in Modern South Asian Glam,
           I'm dedicated to crafting breathtaking bridal hair and makeup
           looks that merge tradition with contemporary flair. I not only
           transform faces but also empower aspiring artists through education.
           Join me on this beauty journey, where every brushstroke tells a story
           of elegance and empowerment.
           -Manpreet Chahal.</p> 
      </div>
      <div className='picture-container'>
        <img src={pic1} alt="pic1" className="about-model-image1" />
      </div>
    </div>
  );
}

export default AboutMe;
