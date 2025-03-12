import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationUser from '../NavigationUser';
import Footer from '../Footer';
const GuideUser = () => {
    const [guides, setGuides] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get('http://localhost:5000/TourGuid');
                setGuides(response.data);
            } catch (error) {
                const errorMessage = error.response
                    ? `Error: ${error.response.status} ${error.response.statusText}`
                    : 'Error fetching tour guides';
                setError(errorMessage);
                console.error('Error fetching tour guides:', error);
            }
        };

        fetchGuides();
    }, []);

    return (
        <div>
            <NavigationUser/>
            <div className="container mt-5">
            <h2 className="mb-4">Tour Guide Profiles</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* Loop through the guides to display each guide's profile */}
                {guides.length > 0 ? (
                    guides.map((guide) => (
                        <div key={guide._id} className="col-md-4">
                            <div className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{guide.firstName} {guide.lastName}</h5>
                                    <p className="card-text">
                                        <strong>Contact:</strong> {guide.contactNumber} <br />
                                        <strong>Email:</strong> {guide.email} <br />
                                        <strong>Experience:</strong> {guide.experience} years <br />
                                        <strong>Specialties:</strong> {guide.specialties ? guide.specialties.split(',').join(', ') : 'N/A'} <br />
                                        <strong>Skills:</strong> {guide.skills ? guide.skills.split(',').join(', ') : 'N/A'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <button className="btn btn-outline-primary">
                                            View Details
                                        </button>
                                        <small className="text-muted">Experience: {guide.experience} yrs</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center">
                            No tour guides available.
                        </div>
                    </div>
                )}
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default GuideUser;
