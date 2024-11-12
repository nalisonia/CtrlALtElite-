import React from 'react';
import '../Styles/TermsOfService.css'; // Import CSS file for styling 

function PrivacyPolicy() {
  return (
    <div className='contactme-container'>
      <h2>Privacy Policy</h2>
      <p><b>1.</b> The site respects user privacy and complies with relevant data protection laws, including the California Consumer Privacy Act (CCPA). </p>
      <p><b>2.</b> When a user registers for the site or files a booking inquiry, their data is stored in a 3rd party database called Supabase, please view 
      <a href="https://supabase.com/privacy"> https://supabase.com/privacy</a> for more information.</p>
      <p><b>3.</b> The data that is stored from users is and is not limited to: Name, Email, Phone Number, Dates, all booking information submitted, User type, etc.</p>
      <p><b>4.</b> This data is confidential and is not viewable to anyone but the site owners.</p>
      <p><b>5.</b> The data that is collected is needed for the site to function correctly for both users and Manpreet.</p>
      <p><b>6.</b> Data is not sold to 3rd parties.</p>
      <p><b>7.</b> Users have the right to know under the CCPA about their data and have the right to request a deletion of said data. For requesting data deletion or 
      general questions please reach out to Manpreet.</p>
      <p><b>8.</b> Site owners reserve the right to update the Privacy Policy at any time.</p>
    </div>
  );
}

export default PrivacyPolicy;