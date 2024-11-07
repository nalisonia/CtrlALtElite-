import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

const ResetPassword = () => {
    useEffect(() => {
        // Listen for password recovery events
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                // Prompt the user to enter a new password
                const newPassword = prompt("What would you like your new password to be?");
                
                // Update the user's password using updateUser
                const { data, error } = await supabase.auth.updateUser({
                    password: newPassword,
                });

                if (data) {
                    alert("Password updated successfully!");
                }
                if (error) {
                    alert("There was an error updating your password: " + error.message);
                }
            }
        });
    }, []);

    return (
        <div>
            <h2>Reset Password</h2>
            <p>Please check your email for the reset link.</p>
        </div>
    );
};

export default ResetPassword;
