import React from 'react';
import '../Styles/Services.css'; 
import makeupIcon from '../assets/images/makeup-icon.png'; 
import masterclassIcon from '../assets/images/masterclass-icon.png'; 
import skincareIcon from '../assets/images/skincare-icon.png'; // Correct path for the skincare icon



function Services() {
  return (
    <div className='services-container'>
      <h2 className='header-text'>Services</h2>
      
      <div className="service-box">
        <img src={makeupIcon} alt="Makeup Icon" className="service-icon" />
        <h3>MAKEUP</h3>
        <p>Heavy<br />Natural<br />Bridal<br />Non-bridal</p>
        <a href="/booking_Inquiry" className="button">Booking Inquiry</a>
      </div>

      <div className="service-box">
        
        <img src={masterclassIcon} alt="Master Class Icon" className="service-icon" />
        <h3>MASTER CLASS</h3>
        <p>Bridal and Non-bridal Lessons<br />Hair<br />Makeup</p>
        <a href="Register" className="button">Learn More</a>
      </div>
    
      {/* Skincare Box */}
      <div className="service-box">
        <img src={skincareIcon} alt="Skin Care Icon" className="service-icon" />
        <h3>SKINCARE</h3>
        <p>Coming soon</p>
        <a href="Register" className="button">Register and get exclusive insights here!</a>
      </div>
    </div>
  );
}

export default Services;