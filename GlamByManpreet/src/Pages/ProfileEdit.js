import React, { useState } from 'react';
import supabase from '../config/supabaseClient.js';
import '../Styles/ProfileEdit.css';
import Snackbar from '@mui/material/Snackbar';
import '../Styles/ProfileEdit.css';


function ProfileEdit() {
  const [password, setPassword] = useState('');
  const [notificationPreference, setNotificationPreference] = useState(
    localStorage.getItem('notificationPreference') || 'email'
  );
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updates = {};
    let message = '';

    if (password && password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (password) {
      updates.password = password;
      message += 'Password';
    }

    setLoading(true);
    try {
      if (password) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }

      // Save notification preference locally
      localStorage.setItem('notificationPreference', notificationPreference);

      setSnackbarMessage(`${message ? `${message} updated` : ''} successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-container">
      <h2 className="profile-edit-title" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Profile Edit</h2>
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-group">
          <label htmlFor="password">Password (optional):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notification">Notification Preferences:</label>
          <select
            id="notification"
            value={notificationPreference}
            onChange={(e) => setNotificationPreference(e.target.value)}
            className="form-input"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="none">None</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="edit-profile-button" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
}

export default ProfileEdit;
