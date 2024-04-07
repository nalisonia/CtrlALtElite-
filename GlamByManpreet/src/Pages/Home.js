import React from 'react';
import model1 from '../assets/images/homepage_image1.png';
import model2 from '../assets/images/homepage_image2.png';
import model3 from '../assets/images/homepage_image3.png';
import model4 from '../assets/images/homepage_image4.png';

import '../Styles/Home.css'; // Import CSS file for styling

function HomePage() {
    return (
        <div className="home-container">            
            <div className='picture-container'>
                <img src={model1} alt="model1" className="model-image" />
                <img src={model2} alt="model2" className="model-image" />
                <img src={model3} alt="model3" className="model-image" />
                <img src={model4} alt="model4" className="model-image" />

            </div>
        </div>
    );
}

export default HomePage;
