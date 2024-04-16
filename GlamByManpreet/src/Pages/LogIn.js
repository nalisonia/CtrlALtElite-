import React from 'react';
import '../Styles/LogIn.css'; // Import CSS file for styling 

function LogIn() {
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
          <button type ='submit'> Forgot Password</button>
        </form>
      </div>
    </div>
  );
}

export default LogIn;