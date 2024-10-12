import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material'; // Updated imports
import '../Styles/Register.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility'; // Updated import
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Updated import
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig'; // Import axios for registration logic


const Register = () => {
  // State for toggling email form visibility
  const [showEmailForm, setShowEmailForm] = useState(false);


  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reenterpassword: '',  // Add reenterpassword to formData state
    showPassword: false,
    showReEnterPassword: false,
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // State to handle error messages
  const navigate = useNavigate();

  // Toggle the email form fields
  const handleEmailSignupClick = () => {
    setShowEmailForm(!showEmailForm);
  };

  const handleShowPasswordClick = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleShowReEnterPasswordClick = () => {
    setFormData((prevs) => ({
      ...prevs,
      showReEnterPassword: !prevs.showReEnterPassword
    }));
  }
  const handleMouseDownReEnterPassword = (event) => {
    event.preventDefault();
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

    // Check if passwords match
    if (formData.password !== formData.reenterpassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true); // Start loading state
    setError('');  // Clear any previous errors

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
        setError('Registration failed. Please try again.');
      } else {
        console.error('Error:', error.message);
        setError('An error occurred. Please try again.');
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
              type={formData.showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleShowPasswordClick}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {formData.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              id="reenterpassword"
              name="reenterpassword"
              label="Re-enter Password"
              type={formData.showReEnterPassword ? "text" : "password"}
              variant="outlined"
              value={formData.reenterpassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleShowReEnterPasswordClick}
                      onMouseDown={handleMouseDownReEnterPassword}
                    >
                      {formData.showReEnterPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mt: 2, mb: 1 }}
              required
            />

            {/* Error message for password mismatch */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

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