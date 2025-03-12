import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Navigation from './Navigation';
import '../css/AdminPage.css';

function Admin() {
    const [inquiries, setInquiries] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/auth/inquiries', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setInquiries(res.data);
                setFilteredInquiries(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchInquiries();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/auth/inquiries/search?query=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFilteredInquiries(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query === '') {
            setFilteredInquiries(inquiries);
        }
    };

    const generatePDF = async (inquiry) => {
        const doc = new jsPDF();
    
        const imageData = 'data:logo/jpeg;base64,...';  // Replace with your image Base64 string
    
        doc.addImage(imageData, 'JPEG', 10, 70, 50, 50);
        doc.text(`Inquiry Report`, 10, 10);
        doc.text(`Name: ${inquiry.name}`, 10, 20);
        doc.text(`Email: ${inquiry.email}`, 10, 30);
        doc.text(`Phone: ${inquiry.phone}`, 10, 40);
        doc.text(`Message: ${inquiry.message}`, 10, 50);
        doc.text(`Submitted At: ${new Date(inquiry.createdAt).toLocaleString()}`, 10, 60);
    
        doc.save(`${inquiry.name}_Inquiry_Report.pdf`);
    };
    

    return (
        <div className="admin-container">
            <Navigation />
            <div className="content-container">
                <h1 className="admin-title">Admin Dashboard</h1>
                <h2 className="admin-subtitle">User Inquiries</h2>
                
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                <ul className="inquiry-list list-group">
                    {filteredInquiries.map(inquiry => (
                        <li key={inquiry._id} className="inquiry-item list-group-item">
                            <p><strong>Name:</strong> {inquiry.name}</p>
                            <p><strong>Email:</strong> {inquiry.email}</p>
                            <p><strong>Phone:</strong> {inquiry.phone}</p>
                            <p><strong>Message:</strong> {inquiry.message}</p>
                            <p><strong>Submitted At:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
                            <button onClick={() => generatePDF(inquiry)} className="btn btn-secondary">
                                <i className="bi bi-file-earmark-pdf-fill"></i> Generate PDF Report
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Admin;
