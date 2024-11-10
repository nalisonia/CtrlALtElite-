/* Services.js */

import React from 'react';
import '../Styles/Services.css'; 
import makeupIcon from '../assets/images/makeup-icon.png'; 
import masterclassIcon from '../assets/images/masterclass-icon.png'; 
import skincareIcon from '../assets/images/skincare-icon.png'; // Correct path for the skincare icon

function Services() {
  return (
    <div className='services-container'>
      <h2 className='header-text'>Services</h2>

      {/* Makeup Service Box */}
      <div className="service-box">
        <img src={makeupIcon} alt="Makeup Application" className="service-icon" />
        <h3>MAKEUP</h3>
        <p>Heavy<br />Natural<br />Bridal<br />Non-bridal</p>
        <a href="/booking_Inquiry" className="button">Booking Inquiry</a>
      </div>

      {/* Master Class Service Box */}
      <div className="service-box">
        <img src={masterclassIcon} alt="Makeup Masterclass" className="service-icon" />
        <h3>MASTER CLASS</h3>
        <p>Bridal and Non-bridal Lessons<br />Hair<br />Makeup</p>
        <a href="/register" className="button">Learn More</a>
      </div>
    
      {/* Skincare Service Box */}
      <div className="service-box">
        <img src={skincareIcon} alt="Skincare Services" className="service-icon" />
        <h3>SKINCARE</h3>
        <p>Coming soon</p>
        <a href="/register" className="button">Register and get exclusive insights here!</a>
      </div>
    </div>
  );
}

export default Services;
