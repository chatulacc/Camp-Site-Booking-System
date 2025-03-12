import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../../component/imeshi/Event';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddEvents() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');
  const [rentperday, setRentPerDay] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [eventType, setEventType] = useState('');
  const [additionalImage, setAdditionalImage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!eventName) newErrors.eventName = 'Event Name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!rentperday) {
      newErrors.rentperday = 'Rent Per Day is required';
    } else if (isNaN(rentperday) || rentperday <= 0) {
      newErrors.rentperday = 'Rent Per Day must be a positive number';
    }
    if (!dateAdded) {
      newErrors.dateAdded = 'Date Added is required';
    } else {
      const today = new Date().toISOString().split('T')[0]; 
      if (dateAdded < today) {
        newErrors.dateAdded = 'Date cannot be in the past';
      }
    }
    if (!eventType) newErrors.eventType = 'Event Type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newEvent = {
      imageurls: [additionalImage], // Assuming the main image URL is no longer needed
      eventName,
      description,
      descript: description2,
      rentperday,
      dateAdded,
      isIndoor: eventType === 'Indoor',
      isOutdoor: eventType === 'Outdoor',
    };

    try {
      const response = await axios.post('http://localhost:5000/api/events/addevent', newEvent);
      console.log('Event added successfully:', response.data);
      alert('Event added successfully!');

      // Reset form fields
      setEventName('');
      setDescription('');
      setDescription2('');
      setRentPerDay('');
      setDateAdded('');
      setEventType('');
      setAdditionalImage('');
    } catch (error) {
      console.error('There was an error adding the event:', error.response?.data || error.message);
    }
  };

  return (
    <div className="content-container">
      <Navigation />
      <h1>Add New Event</h1>
      <form 
        onSubmit={handleSubmit} 
        style={{
          width: '80%',          
          margin: '0 auto',      
          padding: 0,            
          overflowX: 'auto',     
          marginLeft: '200px'    
        }}
      >

        {/* Event Name Input */}
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">Event Name</label>
          <input
            type="text"
            className="form-control"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          {errors.eventName && <div className="text-danger">{errors.eventName}</div>}
        </div>

        {/* Event Type Selection */}
        <div className="mb-3">
          <label htmlFor="eventType" className="form-label">Event Type</label>
          <select
            className="form-select"
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="">Select Event Type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
          {errors.eventType && <div className="text-danger">{errors.eventType}</div>}
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && <div className="text-danger">{errors.description}</div>}
        </div>

        {/* Additional Description Input */}
        <div className="mb-3">
          <label htmlFor="description2" className="form-label">Additional Description</label>
          <textarea
            className="form-control"
            id="description2"
            value={description2}
            onChange={(e) => setDescription2(e.target.value)}
          />
        </div>

        {/* Rent Per Day Input */}
        <div className="mb-3">
          <label htmlFor="rentperday" className="form-label">Rent Per Day (RM)</label>
          <input
            type="number"
            className="form-control"
            id="rentperday"
            value={rentperday}
            onChange={(e) => setRentPerDay(e.target.value)}
            required
          />
          {errors.rentperday && <div className="text-danger">{errors.rentperday}</div>}
        </div>

        {/* Date Added Input */}
        <div className="mb-3">
          <label htmlFor="dateAdded" className="form-label">Date Added</label>
          <input
            type="date"
            className="form-control"
            id="dateAdded"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
            required
          />
          {errors.dateAdded && <div className="text-danger">{errors.dateAdded}</div>}
        </div>

        {/* Additional Image URL Input */}
        <div className="mb-3">
          <label htmlFor="additionalImage" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="additionalImage"
            value={additionalImage}
            onChange={(e) => setAdditionalImage(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>
    </div>
  );
}
