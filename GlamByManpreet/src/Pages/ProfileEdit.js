import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient.js';
import '../Styles/ProfileEdit.css';
import Snackbar from '@mui/material/Snackbar';
import heic2any from 'heic2any'; // Import the HEIC-to-any conversion library

function ProfileEdit() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('email');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        setName(data?.user_metadata?.name || '');
        setEmail(data?.email || '');
        setPhone(data?.user_metadata?.phone || '');
        setNotificationPreference(localStorage.getItem('notificationPreference') || 'email');
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];

    // Check file type
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image: .png, .jpg, .jpeg, or .heic');
      return;
    }

    // If it's a HEIC file, convert it to JPG
    if (file.type === 'image/heic') {
      try {
        const convertedFile = await convertHEICtoJPG(file);
        setProfilePicture(convertedFile);
      } catch (error) {
        setError('Error converting HEIC image');
        console.error(error);
      }
    } else {
      setProfilePicture(file); // Set the selected file (already in a valid format)
    }
  };

  // Function to convert HEIC to JPG using heic2any library
  const convertHEICtoJPG = async (file) => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg', // Convert to JPG format
      });

      return new File([convertedBlob], file.name.replace('.heic', '.jpg'), { type: 'image/jpeg' });
    } catch (error) {
      throw new Error('Error converting HEIC to JPG');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any previous errors
    const updates = {};
    let message = '';

    // Validate password length
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    // Add updated fields to the `updates` object
    if (name) {
      updates.name = name;
      message += 'Name ';
    }
    if (email) {
      updates.email = email;
      message += 'Email ';
    }
    if (phone) {
      updates.phone = phone;
      message += 'Phone ';
    }
    if (password) {
      updates.password = password;
      message += 'Password ';
    }

    // Upload profile picture to Supabase Storage (if a new picture is selected)
    if (profilePicture) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')  // Ensure the bucket exists in Supabase Storage
          .upload(`public/${Date.now()}_${profilePicture.name}`, profilePicture);

        if (error) throw error;

        const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/avatars/${data.path}`;
        updates.avatar_url = imageUrl;  // Save the image URL in user profile
        message += 'Profile Picture ';
      } catch (error) {
        setError('Error uploading profile picture');
        console.error('Upload error:', error);
        return;
      }
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;

      // Save notification preference to localStorage
      localStorage.setItem('notificationPreference', notificationPreference);

      // Show success message
      setSnackbarMessage(`${message ? `${message}updated` : 'Preferences updated'} successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      setError(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-container">
      <h2 className="profile-edit-title" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Profile Edit</h2>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Password */}
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

        {/* Profile Picture */}
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            accept=".png, .jpg, .jpeg, .heic"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        {/* Notification Preferences */}
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

        {/* Submit Button */}
        <button 
          type="submit" 
          className="edit-profile-button" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Success Message Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {/* Display Error */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ProfileEdit;
