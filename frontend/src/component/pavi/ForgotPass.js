import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/forgot-password', { email });
            setMessage(res.data.msg);
        } catch (err) {
            console.error(err);
            setMessage('Error sending reset link');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;