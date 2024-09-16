import React from 'react';
import model1 from '../assets/images/actual_homepage_image2.png';
import model2 from '../assets/images/actual_homepage_image4.png';
import model3 from '../assets/images/actual_homepage_image3.png';
import model4 from '../assets/images/actual_homepage_image1.png';

import '../Styles/Home.css'; // Import CSS file for styling
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="home-container">            
            <div className='picture-container'>
                <img src={model1} alt="model1" className="model-image" />
                <img src={model2} alt="model2" className="model-image" />
                <img src={model3} alt="model3" className="model-image" />
                <img src={model4} alt="model4" className="model-image" />

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
                    <Button 
                    sx={{color:'black', backgroundColor:'#FDF7F8', margin:'0.5vh', width:'100px', border:'1px solid black'}} 
                    component={Link} to="/Booking_Inquiry">Inquire</Button>
                    <Button 
                    sx={{color:'black', backgroundColor:'#FDF7F8', margin:'0.5vh', width:'100px', border:'1px solid black'}} 
                    component={Link} to="/dashboard">DashBoard</Button>
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
