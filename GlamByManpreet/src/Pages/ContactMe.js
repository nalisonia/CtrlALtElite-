import React from 'react';
import '../Styles/ContactMe.css';  // Adjust the path based on your file structure

function ContactMe() {

    const clientEmailLink = "mailto:glambymanpreetk@gmail.com" // Change if client email or support email changes
    const clientEmailInText = "glambymanpreetk@gmail.com" // Change if client email or support email changes
    const clientInstaLink =  "https://www.instagram.com/glambymanpreet?igsh=MzRlODBiNWFlZA=="
    const clientInstaLinkInText =  "@glambymanpreet"
    return (
        <div className="contactme-container">
            <h2>CONTACT ME</h2>
            <p className="intro-text">Hello! I'd love to hear from you—get in touch with me.</p>
            <div className="contact-details">
                <p>Email: 
                    <a href={clientEmailLink} className="email-link">
                        {clientEmailInText}
                    </a>
                </p>
                <p>If you don't hear back from me, please register to see updates on your booking.</p>
                <p>Instagram: 
                    <a 
                        href={clientInstaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="instagram-link"
                    >
                        {clientInstaLinkInText}
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
