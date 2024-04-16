import React from 'react';
import '../Styles/Register.css'; // Import CSS file for styling 

function Register() {
  return (
    <div className='Register-container'>
      <div className='Register-title'>
        <h1>Register</h1>
      </div>
      <div className='Register-form'>
        <form>
          <div>
            <label htmlFor='firstName'> First Name:*</label>
            <div></div>
            <input type ='text' id= 'firstName' name='firstName'/>
          </div>
          <div>
            <label htmlFor='lastName'> Last Name:*</label>
            <div></div>
            <input type ='text' id= 'lastName' name='lastName'/>
          </div>
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
          <div className="checkbox-container">
            <input type='checkbox' id='agreeTerms' name='agreeTerms'/>
            <label htmlFor='agreeTerms'>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</label>
          </div>
          <button type ='submit'> Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;