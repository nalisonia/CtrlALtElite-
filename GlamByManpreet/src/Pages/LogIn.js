import React, { useState } from 'react';
import '../Styles/LogIn.css';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Route

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

  return (
    <div className='LogIn-container'>
      <div className='LogIn-title'>
        <h1>Member Login</h1>
      </div>
      <div className='LogIn-form'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'> Email:*</label>
            <div></div>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='password'> Password:*</label>
            <div></div>
            <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
          </div>
          <button type='submit'> Log In</button>
          <div></div>
          <button type='button'> Forgot Password</button>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
