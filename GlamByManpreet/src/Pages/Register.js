import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import FaceBookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import '../Styles/Register.css';
import supabase from '../config/supabaseClient.js';

const Register = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reenterpassword: '',
    showPassword: false,
    showReEnterPassword: false,
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailSignupClick = () => {
    setShowEmailForm(!showEmailForm);
  };

  const handleShowPasswordClick = () => {
    setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleShowReEnterPasswordClick = () => {
    setFormData(prev => ({ ...prev, showReEnterPassword: !prev.showReEnterPassword }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  //sign up with google using supabase
  const handleGoogleSignUpClick = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://ctrl-a-lt-elite-glg4-nalisonias-projects.vercel.app/userview' }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
  };


  //sign up with facebook using supabase
  const handleFacebookSignUpClick = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      if (error) throw error;
      navigate('/userview');
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    if (formData.password !== formData.reenterpassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      // Attempt sign-up
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signupError) {
        console.error('Signup failed:', signupError.message);
        setError(signupError.message);
        return; // Stop further execution if signup fails
      }

      const user = data?.user;
      if (!user) {
        throw new Error('User data is missing after sign-up.');
      }
    
      console.log('Registration successful');

      // Log session data to the console
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
      } else {
        console.log('Session Data:', sessionData);
      }

      navigate('/userview');
    } catch (error) {
      console.error('Error during registration:', error.message);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box className="register" sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>Sign Up</Typography>
      <Box sx={{ mt: 3 }}>
        <Button fullWidth variant="contained" color="primary" startIcon={<GoogleIcon />} sx={{ mt: 2 }} onClick={handleGoogleSignUpClick}>
          Sign Up with Google
        </Button>
        <Button fullWidth variant="contained" color="secondary" startIcon={<EmailIcon />} sx={{ mt: 2 }} onClick={handleEmailSignupClick}>
          Sign Up with Email
        </Button>

        {showEmailForm && (
          <form onSubmit={handleSubmit}>
            {loading && <CircularProgress sx={{ mb: 2 }} />}
            <TextField fullWidth name="firstName" label="First Name" variant="outlined" value={formData.firstName} onChange={handleChange} sx={{ mt: 2, mb: 1 }} required />
            <TextField fullWidth name="lastName" label="Last Name" variant="outlined" value={formData.lastName} onChange={handleChange} sx={{ mt: 1, mb: 1 }} required />
            <TextField fullWidth name="email" label="Email" type="email" variant="outlined" value={formData.email} onChange={handleChange} sx={{ mt: 1, mb: 1 }} required />
            <TextField fullWidth name="password" label="Password" type={formData.showPassword ? "text" : "password"} variant="outlined" value={formData.password} onChange={handleChange} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClick}>
                      {formData.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }} 
              sx={{ mt: 1 }} 
              required 
            />
            <TextField fullWidth name="reenterpassword" label="Re-enter Password" type={formData.showReEnterPassword ? "text" : "password"} variant="outlined" value={formData.reenterpassword} onChange={handleChange} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowReEnterPasswordClick}>
                      {formData.showReEnterPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }} 
              sx={{ mt: 2, mb: 1 }} 
              required 
            />
            {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
            {successMessage && <Typography color="success" variant="body2" sx={{ mt: 1 }}>{successMessage}</Typography>}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
              <label htmlFor="agreeTerms" style={{ marginLeft: '8px' }}>
                I agree to the <a href="/terms_of_service">Terms of Service</a> and <a href="/privacy_policy">Privacy Policy</a>.
              </label>
            </Box>
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Register;

