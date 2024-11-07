import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Modal, CircularProgress } from '@mui/material'; // Updated imports
import '../Styles/ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSessionValid, setIsSessionValid] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for password recovery events
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                if (!session) {
                    // If the session is invalid, display an error message
                    setIsSessionValid(false);
                    setError("Your session has expired. Please request a new password reset.");
                } else {
                    setOldPassword(session.user.password || "");
                }
            }
        });

        // Cleanup listener on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handlePasswordReset = async () => {
        setError('');
        setSuccess('');

        // Check if passwords match, meet length requirement, and don't match the old password
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword === oldPassword) {
            setError("New password cannot be the same as the old password.");
            return;
        }

        // Update the user's password
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (data) {
            setSuccess("Password updated successfully!");
            navigate('/'); // Navigate to home page on success
        }
        if (error) {
            setError("There was an error updating your password: " + error.message);
        }
    };

    if (!isSessionValid) {
        return (
            <div>
                <h2>Reset Password</h2>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Reset Password</h2>
            <p>Please enter a new password. New password must match and be at least 6 characters long.</p>
    
            <div className="formContainer">
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
    
                <Button
                    variant="contained"
                    className="button"
                    onClick={handlePasswordReset}
                >
                    Update Password
                </Button>
            </div>
    
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default ResetPassword;
