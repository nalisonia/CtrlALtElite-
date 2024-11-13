import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import supabase from '../config/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoogleSignUpClick = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: 'https://glambymanpreet.net/userview' 
      }
    });
    
    if (error) {
      console.error('Error during sign-up:', error);
    }
  };

  const handleEmailSignUpClick = () => {
    setShowEmailForm(!showEmailForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      alert('Registration successful! Check your email for confirmation.');
      navigate('/userview');
    } catch (error) {
      console.error('Sign-up failed:', error);
      setError('Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="register" sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ mb: 3, fontFamily: "'Cormorant Garamond', serif" }}
      >
        Register
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            mt: 2,
            backgroundColor: '#ffc2f9', // Pink background
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ffc2f9', // Keep pink on hover
            },
            '&:focus': {
              backgroundColor: '#ffc2f9', // Keep pink on focus
            },
            '&:active': {
              backgroundColor: '#ffc2f9', // Keep pink on active
            },
          }}
          onClick={handleGoogleSignUpClick}
        >
          Sign Up with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<EmailIcon />}
          sx={{
            mt: 2,
            backgroundColor: '#ffc2f9', // Pink background
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ffc2f9', // Keep pink on hover
            },
            '&:focus': {
              backgroundColor: '#ffc2f9', // Keep pink on focus
            },
            '&:active': {
              backgroundColor: '#ffc2f9', // Keep pink on active
            },
          }}
          onClick={handleEmailSignUpClick}
        >
          Sign Up with Email
        </Button>

        {showEmailForm && (
          <form role="form" onSubmit={handleSubmit}>
            {loading && <CircularProgress sx={{ mb: 2 }} />}
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
            {error && <p className="error-message">{error}</p>}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                disabled={loading}
                sx={{
                  backgroundColor: '#ffc2f9', // Pink background
                  '&:hover': {
                    backgroundColor: '#ffc2f9', // Keep pink on hover
                  },
                  '&:focus': {
                    backgroundColor: '#ffc2f9', // Keep pink on focus
                  },
                  '&:active': {
                    backgroundColor: '#ffc2f9', // Keep pink on active
                  },
                }}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Box>

            <Typography sx={{ mt: 2 }} align="center">
              Already have an account? <a href='/login'>Log In</a>
            </Typography>
          </form>
        )}
      </Box>
    </Box>
  );
}

export default Register;

