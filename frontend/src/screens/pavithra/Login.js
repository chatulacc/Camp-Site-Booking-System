import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);

            if (res.data.role === 'admin') {
                navigate('/dashadmin');
            } else {
                navigate('/homepage');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid login credentials. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h2>Hi, Welcome Back</h2>
                <p>Enter your credentials to continue</p>
                {error && <div className='error-msg'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='login-input'
                    />
                    <div className='password-container'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter at least 8+ characters'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='login-input'
                        />
                        <button
                            type='button'
                            className='password-toggle'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <Link to='/forgot-password' className='forgot-link'>Forget Password?</Link>
                    <button type='submit' className='login-button'>Login</button>
                </form>
                <div className='signup-link'>
                    Don’t have an account? <Link to='/register'>Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
