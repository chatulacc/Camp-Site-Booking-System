import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/register.css'; 

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the email is valid
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1 className="register-title">Sign Up</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="register-input"
                    />
                    <input
                        type="password"
                        placeholder="Password (at least 8+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="register-input"
                    />
                    <div className="checkbox-container">
                        <input type="checkbox" required id="terms" className="register-checkbox" />
                        <label htmlFor="terms" className="register-checkbox-label">
                            I agree with the Terms of Use & Privacy Policy
                        </label>
                    </div>
                    {error && <div className="register-error">{error}</div>}
                    <button type="submit" className="register-button">Create account</button>
                </form>
                <div className="register-footer">
                    <p>Already have an account? <a href="/login">Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
