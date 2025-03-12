import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/InquiryForm.css';

function InquiryForm() {
    const [name, setName] = useState('');     
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [responseMsg, setResponseMsg] = useState('');
    const [phoneError, setPhoneError] = useState(''); // Error message for phone validation
    const navigate = useNavigate();

    // Check for authentication when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if not authenticated
            navigate('/login');
        }
    }, [navigate]);

    // Phone number validation function
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/; // Ensures the phone number is exactly 10 digits
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate phone number before submitting
        if (!isValidPhoneNumber(phone)) {
            setPhoneError('Please enter a valid 10-digit phone number.');
            return;
        } else {
            setPhoneError(''); // Clear the error if valid
        }

        try {
            // Send POST request to the backend
            const res = await axios.post('http://localhost:5000/auth/inquiry', {
                name,
                email,
                phone,
                message,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the token in the request
                }
            });
            setResponseMsg(res.data.msg); // Success message from server

            // Reset the form fields after submission
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');

            // Navigate to another page (e.g., profile) after successful submission
            navigate('/pr');

        } catch (err) {
            console.error(err);
            setResponseMsg('There was an error submitting your inquiry.');
        }
    };

    return (
        <div className='contact-container'>
            <div className='contact-details'>
                <h2>Contact Us</h2>
                <p>1488 Colombo Street, Sri Lanka</p>
                <p>Phone : (+1) 12345678</p>
                <p>Email : campzip@email.com</p>
                <img src='/articleimage.jpg' alt='campsite'/>
            </div>
            <div className='inquiry-form'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    {/* Show error message if the phone number is invalid */}
                    {phoneError && <p className="error-msg">{phoneError}</p>}
                    <textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />

                    <button type="submit">Submit Inquiry</button>
                   
                    {responseMsg && <p className='response-msg'>{responseMsg}</p>}
                </form>
            </div>
        </div>
    );
}

export default InquiryForm;
