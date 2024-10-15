// Auth.js
/*
This single component conditionally renders either login form or password reset form based on users choice. 
It includes a toggle link or button that switches between the login & forgotpassord views w/in same component.
*/

import React, { useState } from 'react';
import supabase from '../config/supabaseClient';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        // Handle successful login
      } else {
        const response = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error('Failed to send reset link');
        setSuccessMessage('Password reset link has been sent to your email.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Member Login' : 'Forgot Password'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div>
            <p>A password reset link will be sent to your email.</p>
          </div>
        )}
        {isLogin && (
          <div>
            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type='submit' disabled={loading}>
          {loading ? (isLogin ? 'Logging in...' : 'Sending...') : (isLogin ? 'Log In' : 'Send Reset Link')}
        </button>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Forgot Password?' : 'Back to Login'}
        </p>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
}

export default Auth;
