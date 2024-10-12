import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import '../Styles/Register.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';import axios from '../config/axiosConfig';  // Import axios for registration logic

const Register = () => {
  // State for toggling email form visibility
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle the email form fields
  const handleEmailSignupClick = () => {
    setShowEmailForm(!showEmailForm);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    try {
      const response = await axios.post('http://localhost:3000/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        console.log('Registration successful');
        navigate('/userview');
      }
    } catch (error) {
      if (error.response) {
        console.error('Registration failed:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false); // End loading state
    }
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
          onClick={handleEmailSignupClick}
        >
          Sign Up with Email
        </Button>

        {showEmailForm && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              sx={{ mt: 2, mb: 1 }}
              required
            />
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={handleChange}
              sx={{ mt: 1, mb: 1 }}
              required
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ mt: 1, mb: 1 }}
              required
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ mt: 1 }}
              required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
              </Typography>
            </Box>

            <Button fullWidth type="submit" variant="contained" color="primary" className="signUpButton" sx={{ mt: 3 }}>
              Sign Up
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Register;

