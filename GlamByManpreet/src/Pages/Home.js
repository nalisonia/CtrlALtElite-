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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    return (
        <div className="home-container">            
            <div className='picture-container'>
        {isMobile ? (
          <Swiper spaceBetween={1} slidesPerView={1} loop={false}>
            {[model1, model2, model3, model4
            ].map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <img src={imageSrc} alt={`model${index + 1}`} className="model-image" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <>
            <img src={model1} alt="model1" className="model-image" />
            <img src={model2} alt="model2" className="model-image" />
            <img src={model3} alt="model3" className="model-image" />
            <img src={model4} alt="model4" className="model-image" />
          </>
        )}
      </div>
            <div className='some-content'>
                <h1>Welcome to GLAM by Manpreet, Sacramento's Premier Destination for Modern South Asian Glamour</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium, nisi ut volutpat mollis, 
                    leo risus interdum arcu, eget facilisis quam felis id mauris. Ut convallis libero in urna ultrices accumsan. 
                    Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus 
                    et magnis dis parturient montes, nascetur ridiculus mus. In rutrum ac purus sit amet tempus.</p>
            </div>
            <div className='info-boxes-container'>
                <div className='info-box'>
                    <h2>Services</h2>
                    <p>eget facilisis quam felis id mauris. Ut convallis libero in urna ultrices accumsan. 
                    Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus 
                    et magnis dis parturient montes, nascetur ridiculus mus.</p>
                </div>
                <div className='info-box'> 
                    <h2>Inquire Now!</h2>
                </div>
                <div className='info-box'>
                    <h2>Testimonials</h2>
                    <p>eget facilisis quam felis id mauris. Ut convallis libero in urna ultrices accumsan. 
                    Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus 
                    et magnis dis parturient montes, nascetur ridiculus mus.</p>
                </div>
            </div>
        </div>    
    );
}
export default HomePage;