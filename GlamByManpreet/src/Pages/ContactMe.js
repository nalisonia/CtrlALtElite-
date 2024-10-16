import React from 'react';
import '../Styles/ContactMe.css';  // Adjust the path based on your file structure

function ContactMe() {
    return (
        <div className='contactme-container'>
            <h2>Contact Me Page</h2>
            <p>Hello! I'd love to hear from you—get in touch with me.</p>

            <div className="contact-details">
                <p>Email: 
                    <a href="mailto:youremail@example.com" className="email-link">
                        glambymanpreetk@gmail.com
                    </a>
                </p>
                <p>Business Phone Number: <span>(123) 456-7890</span></p>
                <p>Instagram: <span>@glambymanpreet</span></p>
            </div>

            <div className="disclaimer">
                <p>DISCLAIMER: Takes 1 - 3 business days for response back.</p>
            </div>
        </div>
    );
}

export default ContactMe;
