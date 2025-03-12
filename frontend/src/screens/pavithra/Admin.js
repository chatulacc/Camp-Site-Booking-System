import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import logo from '../../screens/pavithra/Logo/logo2.jpg';  // Import the logo
import Navigation from './Navigation';
import '../pavithra/css/AdminPage.css';  // Make sure your CSS is properly updated

function Admin() {
    const [inquiries, setInquiries] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch inquiries when the component mounts
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

    // Handle the search functionality
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

    // Handle search query changes
    const handleChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query === '') {
            setFilteredInquiries(inquiries); // Reset if search query is cleared
        }
    };

    // PDF generation function
    const generatePDF = async () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const lineHeight = 8;
        let yPosition = margin;

        const timestamp = new Date().toLocaleString();

        // Add footer function with timestamp on every page
        const addFooter = (pageNumber) => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.setTextColor(100);
            const footerText = `Page ${pageNumber} of ${pageCount}`;
            const timestampText = ``;
            doc.text(timestampText, margin, pageHeight - 10);
            doc.text(footerText, pageWidth - margin - doc.getTextWidth(footerText), pageHeight - 10);
        };

        // Add a square logo (1x1 aspect ratio)
        const logoSize = 40;  // Adjust this size as per your preference
        const logoXPosition = (pageWidth - logoSize) / 2;  // Center the logo
        doc.addImage(logo, 'JPEG', logoXPosition, yPosition, logoSize, logoSize);
        yPosition += logoSize + 10;

        // Add a centered title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40); // Dark gray color
        const title = "User Inquiries Report";
        const titleXPosition = (pageWidth - doc.getTextWidth(title)) / 2;
        doc.text(title, titleXPosition, yPosition);
        yPosition += 15;

        // Separator line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Header for the inquiries section
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("Inquiries", margin, yPosition);
        yPosition += 10;

        // Loop through inquiries and add to the PDF
        filteredInquiries.forEach((inquiry, index) => {
            if (yPosition + lineHeight * 6 > pageHeight - margin - 20) {
                // If space runs out, create a new page
                addFooter(doc.internal.getNumberOfPages());
                doc.addPage();
                yPosition = margin;

                // Add the logo and title again on the new page
                doc.addImage(logo, 'JPEG', logoXPosition, yPosition, logoSize, logoSize);
                yPosition += logoSize + 10;

                doc.setFontSize(18);
                doc.text(title, titleXPosition, yPosition);
                yPosition += 15;

                // Add a separator line on the new page
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                // Inquiries header for the new page
                doc.setFontSize(14);
                doc.text("Inquiries", margin, yPosition);
                yPosition += 10;
            }

            // Add inquiry details
            doc.setFontSize(12);
            doc.setTextColor(40, 40, 40);  // Standard dark text color
            doc.text(`Inquiry #${index + 1}`, margin, yPosition);
            yPosition += lineHeight;

            doc.setFontSize(11);
            doc.setTextColor(80);  // Slightly lighter text for details
            doc.text(`Name: ${inquiry.name}`, margin + 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Email: ${inquiry.email}`, margin + 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Phone: ${inquiry.phone}`, margin + 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Message: ${inquiry.message}`, margin + 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Submitted At: ${new Date(inquiry.createdAt).toLocaleString()}`, margin + 10, yPosition);
            yPosition += lineHeight + 5;  // Extra spacing between inquiries
        });

        // Add footer on the last page
        addFooter(doc.internal.getNumberOfPages());

        // Save the PDF file
        doc.save(`Inquiries_Report_${new Date().toLocaleDateString()}.pdf`);
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

                {/* Generate Report button */}
                <button onClick={generatePDF} className="btn btn-secondary generate-report-btn">
                    <i className="bi bi-file-earmark-pdf-fill"></i> Generate Report
                </button>

                <ul className="inquiry-list list-group">
                    {filteredInquiries.map(inquiry => (
                        <li key={inquiry._id} className="inquiry-item list-group-item">
                            <p><strong>Name:</strong> {inquiry.name}</p>
                            <p><strong>Email:</strong> {inquiry.email}</p>
                            <p><strong>Phone:</strong> {inquiry.phone}</p>
                            <p><strong>Message:</strong> {inquiry.message}</p>
                            <p><strong>Submitted At:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Admin;
