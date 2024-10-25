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

  const handleGoogleSignUpClick = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      navigate('/userview');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
    }
  };

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
    if (formData.password !== formData.reenterpassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage(''); // Reset success message

    try {
      // Use Supabase to sign up the user
      const { user, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signupError) throw signupError;

      // After successful sign-up, insert user details into the accounts table
      const { data, error: insertError } = await supabase
        .from('accounts') // Replace with your actual table name
        .insert([
          { id: user.id, email: formData.email, firstName: formData.firstName, lastName: formData.lastName },
        ]);

      if (insertError) throw insertError;

      console.log('Registration successful');
      setSuccessMessage('You are registered'); // Set success message
      setTimeout(() => navigate('/userview'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="register" sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>Sign Up</Typography>
      <Box sx={{ mt: 3 }}>
        <Button fullWidth variant="contained" color="secondary" startIcon={<FaceBookIcon />} sx={{ mt: 2 }} onClick={handleFacebookSignUpClick}>
          Sign Up with Facebook
        </Button>
        <Button fullWidth variant="contained" color="primary" startIcon={<GoogleIcon />} sx={{ mt: 2 }} onClick={handleGoogleSignUpClick}>
          Sign Up with Google
        </Button>
        <Button fullWidth variant="contained" color="primary" startIcon={<EmailIcon />} sx={{ mt: 2 }} onClick={handleEmailSignupClick}>
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
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
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

