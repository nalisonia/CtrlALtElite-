import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import model1 from '../assets/images/actual_homepage_image2.png';
import model2 from '../assets/images/actual_homepage_image4.png';
import model3 from '../assets/images/actual_homepage_image3.png';
import model4 from '../assets/images/actual_homepage_image1.png';

import '../Styles/Home.css'; // Import CSS file for styling
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () =>{

    const [isMobile, setIsMobile] = useState(false);
    const [showSwiper, setShowSwiper] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowSwiper(false);
    const timer = setTimeout(() => setShowSwiper(true), 50); // Adjust delay if necessary
    return () => clearTimeout(timer);
}, [isMobile]);

    return (
        <div className="home-container">            
            <div className='picture-container'>
            {showSwiper && (
                    isMobile ? (
                        <Swiper key="mobile" spaceBetween={1} slidesPerView={1} loop={false}>
                            {[model1, model2, model3, model4].map((imageSrc, index) => (
                                <SwiperSlide key={index}>
                                    <img src={imageSrc} alt={`model${index + 1}`} className="model-image" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div key="desktop" className="desktop-images">
                            <img src={model1} alt="model1" className="model-image" />
                            <img src={model2} alt="model2" className="model-image" />
                            <img src={model3} alt="model3" className="model-image" />
                            <img src={model4} alt="model4" className="model-image" />
                        </div>
                    )
                )}
      </div>
            <div className='some-content'>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome to GLAM by Manpreet</h1>
                <p>Born and raised in Sacramento. I'm a professional makeup artist leaving my fingerprints on the beauty world at every turn. From working with celebrities like Diljit Dosanjh to making every bride feel beautiful and special on their wedding days, I do everything.

                </p>
            </div>
            <div className='info-boxes-container'>
                <div className='info-box'>
                    <h2>Services</h2>
                    <p>Makeup:  Wedding Engagement, Rokha, Jaggo, Mehendi, Photoshoot, Other</p>
                    <p>Master Class: Bridal/Non-Bridal Lessons, Hair, Makeup</p>
                    <p>Skincare: Coming Soon</p>
                    <p></p>

                </div>
                <div className='info-box'> 
                    <h2>Inquire Now!</h2>
                    <p>I only accept booking inquiries through the website. All inquireis will be reviewed, and I will wither approve or decline them.</p>
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "#FDF7F8",
                            margin: "1.6vh",
                            width: "25%",
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
                        Inquire
          </Button>
                     
                </div>
                <div className='info-box'>
                    <h2>Testimonials</h2>
                    <p>"thank you! your talent is unmatched🤍🤍"</p>
                    <p>"you crushed this wow😍🔥"</p>
                    <p>"killed it with this🔥🔥🔥"</p>
                </div>
            </div>
        </div>    
    );
}
export default HomePage;