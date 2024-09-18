import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import '../Styles/Register.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email'; 

const Register = () => {
  // Hide email form on load
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Click handler to toggle the email signup fields
  const handleEmailSignupClick = () => {
    setShowEmailForm(!showEmailForm);
  };

  return (
    <Box className="register" sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Sign Up
      </Typography>
      <Box sx={{ mt: 3 }}>

        <Button 
          fullWidth 
          variant="contained" 
          color="secondary" 
          startIcon={<InstagramIcon />} 
          className="instagramButton" 
          sx={{ mt: 2 }} 
          href="INSTAGRAM_AUTH_URL_GOES_HERE" 
        >
          Sign Up with Instagram
        </Button>

        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<GoogleIcon />} 
          className="googleButton" 
          sx={{ mt: 2 }} 
          href="GOOGLE_AUTH_URL_GOES_HERE" 
        >
          Sign Up with Google
        </Button>

        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<EmailIcon />} 
          className="emailButton" 
          sx={{ mt: 2 }} 
          onClick={handleEmailSignupClick} /* Attach click handler to this button */
        >
          Sign Up with Email
        </Button>

        {/* Toggle first name, last name, email, password fields */}
        {showEmailForm && (
          <>
            {/* First Name and Last Name fields */}
            <TextField
              fullWidth
              id="firstName"
              label="First Name"
              variant="outlined"
              className="textField"
              sx={{ mt: 2, mb: 1 }} 
            />
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              variant="outlined"
              className="textField"
              sx={{ mt: 1, mb: 1 }} 
            />

            {/* Email and Password fields */}
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              className="textField"
              sx={{ mt: 1, mb: 1 }} 
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              className="textField"
              sx={{ mt: 1 }} 
            />

            <Button fullWidth variant="contained" color="primary" className="signUpButton" sx={{ mt: 3 }}>
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Register;