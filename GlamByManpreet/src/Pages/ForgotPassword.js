//  ./src/Components/ForgotPassword.js
/*
ForgotPassword.js: This component is for users who may have forgotten their passwords 
and need to reset them. It generally involves sending a password reset link to the user's email.
*/
import React, { useState } from 'react';
import supabase from '../config/supabaseClient';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
    
        const { error } = await supabase.auth.api.resetPasswordForEmail(email, {

            redirectTo: 'https://glambymanpreet.net/ResetPassword'

        });
    
        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset email sent!');
        }
    };

    return (
        <form onSubmit={handleResetPassword}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <button type="submit">Reset Password</button>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </form>
    );
};

export default ForgotPassword;
