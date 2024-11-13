/* Services.js */

import React from 'react';
import '../Styles/Services.css'; 
import  { Button } from "@mui/material";
import makeupIcon from '../assets/images/makeup-icon.png'; 
import masterclassIcon from '../assets/images/masterclass-icon.png'; 
import skincareIcon from '../assets/images/skincare-icon.png'; // Correct path for the skincare icon
import { Link } from "react-router-dom";

function Services() {
  return (
    <div className='services-container'>
      {/* Change the heading tag from h3 to h2 */}
      <h1 className='header-text'>Services</h1>

      {/* Makeup Service Box */}
      <div className="service-box">
        <img src={makeupIcon} alt="Makeup Application" className="service-icon" />
        <h3>MAKEUP</h3>
        <p>Natural<br />Bridal<br />Non-bridal</p>
        <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",  // Smooth rounded corners
                            padding: "10px 20px",  // Better padding for clickable area
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s", // Smooth transition for hover effect
                            "&:hover": {
                                backgroundColor: "#ff99ff", // Lighter shade on hover
                                transform: "scale(1.05)", // Slight scale effect for hover
                            },
                        }}
                        component={Link} 
                        to="/booking_Inquiry"
                    >
                        Booking Inquiry
          </Button>
      </div>

      {/* Master Class Service Box */}
      <div className="service-box">

       

        <img src={masterclassIcon} alt="Master Class Icon" className="service-icon" />

        <h3>MASTER CLASS</h3>
        <p>Bridal and Non-bridal Lessons<br />Hair<br />Makeup</p>
        <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",  // Smooth rounded corners
                            padding: "10px 20px",  // Better padding for clickable area
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s", // Smooth transition for hover effect
                            "&:hover": {
                                backgroundColor: "#ff99ff", // Lighter shade on hover
                                transform: "scale(1.05)", // Slight scale effect for hover
                            },
                        }}
                        component={Link} 
                        to="/register"
                    >
                        Learn More
          </Button>
      </div>
    
      {/* Skincare Service Box */}
      <div className="service-box">
        <img src={skincareIcon} alt="Skincare Services" className="service-icon" />
        <h3>SKINCARE</h3>
        <p>Coming soon</p>
        <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#ffc5fc",
                            margin: "1.6vh",
                            width: "70%",
                            border: "1px solid black",
                            borderRadius: "8px",  // Smooth rounded corners
                            padding: "10px 20px",  // Better padding for clickable area
                            marginTop: 'auto',
                            transition: "background-color 0.3s, transform 0.2s", // Smooth transition for hover effect
                            "&:hover": {
                                backgroundColor: "#ff99ff", // Lighter shade on hover
                                transform: "scale(1.05)", // Slight scale effect for hover
                            },
                        }}
                        component={Link} 
                        to="/register"
                    >
                        Register and get exclusive insights here!
          </Button>
      </div>
    </div>
  );
}

export default Services;
