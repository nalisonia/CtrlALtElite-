import React from 'react';
import model1 from '../assets/images/homepage_image1.png';
import model2 from '../assets/images/homepage_image2.png';
import '../Styles/Home.css'; // Import CSS file for styling

function HomePage() {
    return (
        <div className="home-container">            
            <div className='picture-container'>
                <img src={model1} alt="model1" className="model-image" />
                <img src={model2} alt="model2" className="model-image" />
            </div>
        </div>
    );
}

export default HomePage;
