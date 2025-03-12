// frontend/src/screens/UpdateDetails.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const UpdateDetails = () => {
  const { id } = useParams(); // Get the event ID from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const { eventData } = location.state || {};

  const [formData, setFormData] = useState({
    imagesUrl: '',
    eventType: '',
    whatsIncluded: [],
    whatsNotIncluded: [],
    keyFeatures: [],
    termsAndConditions: [],
    thingsToKeepInMind: '',
    otherInformation: ''
  });

  useEffect(() => {
    if (eventData) {
      setFormData(eventData);
    } else {
      // Fetch the event data if not passed through location.state
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/event-details/${id}`);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };
      fetchData();
    }
  }, [id, eventData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? [...prevData[name], value] : prevData[name].filter((item) => item !== value)
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/event-details/${id}`, formData);
      alert('Event updated successfully!');
      navigate(`/details/${id}`, { state: { eventData: formData } });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Event Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Include form fields to update details, similar to the AddDetails form */}
        <button type="submit" className="btn btn-success">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateDetails;
