import React, { useState } from 'react';
import '../Styles/LogIn.css';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Modal } from '@mui/material'; // Updated imports
import InstagramIcon from '@mui/icons-material/Instagram';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility'; // Updated import
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Updated import

function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(''); // State for forgot password email
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEmailLogInClick = () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }
    try {
      const response = await axios.post('/login', {
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 200) {
        console.log('Login successful');
        navigate('/userview'); // Redirect to the userview page after successful login
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setError('Login failed. Please try again.\n Please Note: Case Sensitive');
    }
  };
  

  const handleForgotPassword = async () => {
    setError(''); // Reset error message
    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }
    try {
      const response = await axios.post('/forgot-password', {
        email: forgotEmail,
      });
      if (response.status === 200) {
        alert('Password reset link sent! Check your email.');
        setIsModalOpen(false); // Close modal
        setForgotEmail(''); // Clear the input field
      } else {
        setError('Error sending reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset link:', error.response ? error.response.data : error.message);
      setError('Error sending reset link. Please try again.');
    }
  };
  

  return (
    <Box className="login" sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Log In
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
          Log In with Instagram
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
          Log In with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<EmailIcon />}
          className="emailButton"
          sx={{ mt: 2 }}
          onClick={handleEmailLogInClick}
        >
          Log In with Email
        </Button>

        {showEmailForm && (
          <form onSubmit={handleSubmit}>
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
{error && <p className="error-message">{error}</p>} {/* Display error messages */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Log In
              </Button>
              <Button variant="text" onClick={() => setIsModalOpen(true)}>
                Forgot Password
              </Button>
            </Box>

            <Typography sx={{ mt: 2 }}>
              Don't have an account? <a href='/Register'>Register</a>
            </Typography>
          </form>
        )}
      </Box>

      {/* Modal for Forgot Password */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-content" sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, margin: 'auto' }}>
          <Typography id="modal-title" variant="h6">
            Reset Password
          </Typography>
          <TextField
            fullWidth
            type="email"
            label="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          <Button variant="contained" color="primary" onClick={handleForgotPassword}>
            Send Reset Link
          </Button>
          <Button variant="text" sx={{ mt: 2 }} onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LogIn;
