import React, { useState } from 'react';
import '../Styles/LogIn.css';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
      setError('Login failed. Please try again.');
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
    <div className='LogIn-container'>
      <div className='LogIn-title'>
        <h1>Member Login</h1>
      </div>

      <div className='LogIn-form'>
        <form onSubmit={handleSubmit}>
          <div>  
            <label htmlFor='email'>Email:*</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='password'>Password:*</label>
            <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
          </div>
          {error && <p className="error-message">{error}</p>} {/* Display error messages */}
          <div className='buttons-container'>
            <button type='submit'>Log In</button>
            <button type='button' onClick={() => setIsModalOpen(true)}>Forgot Password</button>
          </div>
          <p>Don't have an account? <a href='/Register'>Register</a></p>
          {/* TODO: Implement password strength meter */}
        </form>
      </div>

      {/* Modal for Forgot Password */}
      {isModalOpen && (
        <div>
          <div className='modal-overlay' onClick={() => setIsModalOpen(false)} /> {/* Overlay */}
          <div className='modal-content'>
            <h2>Reset Password</h2>
            <input
              type='email'
              placeholder='Enter your email'
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button onClick={handleForgotPassword}>Send Reset Link</button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default LogIn;
