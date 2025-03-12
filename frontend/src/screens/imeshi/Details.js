// frontend/src/screens/Details.js

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Details = () => {
    const location = useLocation();
    const { eventData } = location.state || {};

    // State to hold updated event data
    const [updatedData, setUpdatedData] = useState(eventData || {}); // Initialize with eventData or empty object

    if (!eventData) {
        return <div>No event data available.</div>; // Early return if eventData is not available
    }

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle update submission
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/event-details/${updatedData._id}`, updatedData);
            alert('Event updated successfully!');
            // Optionally, you can redirect or refetch data here
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            
            <div className="mb-3">
                <strong>Event Type:</strong>
                <input
                    type="text"
                    name="eventType"
                    value={updatedData.eventType}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>Image URL:</strong>
                <input
                    type="text"
                    name="imagesUrl"
                    value={updatedData.imagesUrl}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>What's Included:</strong>
                <textarea
                    name="whatsIncluded"
                    value={updatedData.whatsIncluded.join(', ')} // Convert array to string for input
                    onChange={(e) => handleInputChange({ target: { name: 'whatsIncluded', value: e.target.value.split(', ') } })}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>What's Not Included:</strong>
                <textarea
                    name="whatsNotIncluded"
                    value={updatedData.whatsNotIncluded.join(', ')}
                    onChange={(e) => handleInputChange({ target: { name: 'whatsNotIncluded', value: e.target.value.split(', ') } })}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>Key Features:</strong>
                <textarea
                    name="keyFeatures"
                    value={updatedData.keyFeatures.join(', ')}
                    onChange={(e) => handleInputChange({ target: { name: 'keyFeatures', value: e.target.value.split(', ') } })}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>Terms and Conditions:</strong>
                <textarea
                    name="termsAndConditions"
                    value={updatedData.termsAndConditions.join(', ')}
                    onChange={(e) => handleInputChange({ target: { name: 'termsAndConditions', value: e.target.value.split(', ') } })}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>Event Name:</strong>
                <input
                    type="text"
                    name="thingsToKeepInMind"
                    value={updatedData.thingsToKeepInMind}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <strong>Other Information:</strong>
                <textarea
                    name="otherInformation"
                    value={updatedData.otherInformation}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>

            {/* Update Button */}
            <button className="btn btn-success" onClick={handleUpdate}>
                Update Event
            </button>
        </div>
    );
};

export default Details;
