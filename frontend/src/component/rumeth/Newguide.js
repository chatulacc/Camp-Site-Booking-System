import React, { useState } from 'react';
import Navigation from './Navigation';

const Newguide = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        specialties: '',
        skills: '',
        DOB: '',
        experience: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData); // Log the data being submitted
    
        try {
            const response = await fetch('http://localhost:5000/TourGuid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            console.log('Response status:', response.status); // Log response status
            if (response.ok) {
                const result = await response.json();
                console.log('Form submitted successfully:', result);
                alert('Tour Guide added successfully!');
            } else {
                const errorResponse = await response.json();
                console.error('Error response from server:', errorResponse);
                alert('Failed to add tour guide: ' + errorResponse.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error occurred while submitting the form.');
        }
    };
    
    return (
        <div >
            <Navigation/>
            <div className="container mt-5">
            <h2 className="mb-4">Add Tour Guide</h2>
            <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h4>Personal Information</h4>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="DOB">DOB</label>
                    <input
                        className="form-control"
                        id="DOB"
                        type="date"
                        value={formData.DOB}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="experience">Experience</label>
                    <input
                        type="text"
                        className="form-control"
                        id="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Experience"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>

                {/* Professional Details */}
                <h4>Professional Details</h4>
                <div className="form-group">
                    <label htmlFor="specialties">Specialties</label>
                    <input
                        type="text"
                        className="form-control"
                        id="specialties"
                        value={formData.specialties}
                        onChange={handleChange}
                        placeholder="Specialties"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                        className="form-control"
                        id="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Skills"
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-success">Add Tour Guide</button>
            </form>
            </div>
           
        </div>
    );
};

export default Newguide;
