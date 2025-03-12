import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/profile.css';

function Profile() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        phone: '',
    });
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingInquiry, setEditingInquiry] = useState(null);
    const [phoneError, setPhoneError] = useState('');  // Error state for profile phone validation
    const [inquiryPhoneError, setInquiryPhoneError] = useState('');  // Error state for inquiry phone validation

    useEffect(() => {
        const fetchProfileAndInquiries = async () => {
            try {
                const token = localStorage.getItem('token');
                const profileRes = await axios.get('http://localhost:5000/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUser(profileRes.data);
                const inquiriesRes = await axios.get('http://localhost:5000/auth/user-inquiries', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setInquiries(inquiriesRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile or inquiries');
                setLoading(false);
            }
        };
        fetchProfileAndInquiries();
    }, []);

    // Phone number validation function (exactly 10 digits)
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Validate phone number before updating profile
        if (!isValidPhoneNumber(user.phone)) {
            setPhoneError('Please enter a valid 10-digit phone number.');
            return;
        } else {
            setPhoneError('');  // Clear error if valid
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/auth/profile', user, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleUpdateInquiry = async (e) => {
        e.preventDefault();

        // Validate phone number before updating inquiry
        if (!isValidPhoneNumber(editingInquiry.phone)) {
            setInquiryPhoneError('Please enter a valid 10-digit phone number.');
            return;
        } else {
            setInquiryPhoneError('');  // Clear error if valid
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/auth/inquiry/${editingInquiry._id}`, editingInquiry, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setInquiries(inquiries.map(i => (i._id === editingInquiry._id ? res.data : i)));
            setEditingInquiry(null);
        } catch (err) {
            setError('Failed to update inquiry');
        }
    };

    const handleDeleteInquiry = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/auth/inquiry/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setInquiries(inquiries.filter(inquiry => inquiry._id !== id));
        } catch (err) {
            setError('Failed to delete inquiry');
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-container">
            <form onSubmit={handleUpdateProfile} className="profile-form">
                <h2>User Profile</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className="profile-input"
                    />
                    {/* Display phone validation error if present */}
                    {phoneError && <p className="error-msg">{phoneError}</p>}
                </div>
                <button type="submit" className="update-button">Update Profile</button>
            </form>

            <h2>Your Inquiries</h2>
            {editingInquiry ? (
                <form onSubmit={handleUpdateInquiry} className="inquiry-form">
                    <input
                        type="text"
                        value={editingInquiry.name}
                        onChange={(e) => setEditingInquiry({ ...editingInquiry, name: e.target.value })}
                        className="inquiry-input small-input"
                    />
                    <input
                        type="email"
                        value={editingInquiry.email}
                        onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                        className="inquiry-input small-input"
                    />
                    <input
                        type="tel"
                        value={editingInquiry.phone}
                        onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                        className="inquiry-input small-input"
                    />
                    {/* Display inquiry phone validation error if present */}
                    {inquiryPhoneError && <p className="error-msg">{inquiryPhoneError}</p>}
                    <textarea
                        value={editingInquiry.message}
                        onChange={(e) => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                        className="inquiry-textarea"
                    />
                    <button type="submit" className="update-inquiry-button small-button">Update Inquiry</button>
                    <button type="button" onClick={() => setEditingInquiry(null)} className="cancel-button small-button">Cancel</button>
                </form>
            ) : (
                <div className="inquiry-grid">
                    {inquiries.map(inquiry => (
                        <div key={inquiry._id} className="inquiry-item">
                            <p>{inquiry.name}</p>
                            <p>{inquiry.email}</p>
                            <p>{inquiry.phone}</p>
                            <p>{inquiry.message}</p>
                            <button onClick={() => setEditingInquiry(inquiry)} className="edit-button small-button">Edit</button>
                            <button onClick={() => handleDeleteInquiry(inquiry._id)} className="delete-button small-button">Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;
