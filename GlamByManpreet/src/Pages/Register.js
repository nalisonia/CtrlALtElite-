// Register.js
import React, { useState } from 'react';
import '../Styles/Register.css';
import axios from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Route


function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      

      if (response.status === 201) {
        console.log('Registration successful');
        navigate('/');
     
      }
    } catch (error) {
      if (error.response) {
        console.error('Registration failed:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className='Register-container'>
      <div className='Register-title'>
        <h1>Register</h1>
      </div>
      <div className='Register-form'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='firstName'>First Name:*</label>
            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='lastName'>Last Name:*</label>
            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='email'>Email:*</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='password'>Password:*</label>
            <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} required />
          </div>
          <div className="checkbox-container">
            <input type='checkbox' id='agreeTerms' name='agreeTerms' checked={formData.agreeTerms} onChange={handleChange} required />
            <label htmlFor='agreeTerms'>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</label>
          </div>
          <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
