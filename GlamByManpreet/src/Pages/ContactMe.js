import React from 'react';
import '../Styles/ContactMe.css';  // Adjust the path based on your file structure

function ContactMe() {
    return (
        <div className="contactme-container">
            <h2>CONTACT ME</h2>
            <p className="intro-text">Hello! I'd love to hear from you—get in touch with me.</p>
            <div className="contact-details">
                <p>Email: 
                    <a href="mailto:glambymanpreetk@gmail.com" className="email-link">
                        glambymanpreetk@gmail.com
                    </a>
                </p>
                <p>If you don't hear back from me, please register to see updates on your booking.</p>
                <p>Instagram: 
                    <a 
                        href="https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA==" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="instagram-link"
                    >
                        @glambymanpreet
                    </a>
                </p>
            </div>
            <div className="disclaimer">
                <p>DISCLAIMER: Takes 1 - 3 business days for response back.</p>
            </div>
        </div>
    );
}

export default ContactMe;
