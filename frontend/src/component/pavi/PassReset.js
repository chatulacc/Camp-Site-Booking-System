import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams(); // Get token from URL
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, { password });
            setMessage(res.data.msg);
        } catch (err) {
            console.error(err);
            setMessage('Error resetting password');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;
