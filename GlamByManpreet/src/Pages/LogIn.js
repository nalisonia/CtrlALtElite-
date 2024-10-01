// LogIn.js
import React, { useState } from 'react';
import '../Styles/LogIn.css';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log('Login successful');
        navigate('/'); // Redirect to the home page after successful login
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");

    if (email) {
      try {
        const response = await axios.post('http://localhost:3000/forgot-password', {
          email,
        });

        alert(response.data.message); // Display the message from the server
      } catch (error) {
        console.error('Error sending forgot password request:', error.response ? error.response.data : error.message);
        alert('An error occurred while sending the reset link. Please try again.');
      }
    }
  };

  return (
    <div className='LogIn-container'>
      <div className='LogIn-title'>
        <h1>Member Login</h1>
      </div>
      <div className='LogIn-form'>
        <form>
          <div>
            <label htmlFor='email'> Email:*</label>
            <div></div>
            <input type ='email' id= 'email' name='email'/>
          </div>
          <div>
            <label htmlFor='password'> Password:*</label>
            <div></div>
            <input type ='password' id= 'password' name='password'/>
          </div>
          <button type ='submit'> Log In</button>
          <div></div>
          <button type='button' onClick={handleForgotPassword}> Forgot Password?</button>
        </form>
      </div>
    </div>
  );
}

export default LogIn;