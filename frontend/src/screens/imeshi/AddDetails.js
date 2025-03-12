import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../../component/imeshi/Event';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const AddDetailsForm = () => {
  const [formData, setFormData] = useState({
    imagesUrl: '',
    eventType: '',
    whatsIncluded: [],
    whatsNotIncluded: [],
    keyFeatures: [],
    termsAndConditions: [],
    thingsToKeepInMind: '',
    otherInformation: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.imagesUrl) {
      newErrors.imagesUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(formData.imagesUrl)) {
      newErrors.imagesUrl = 'Please enter a valid image URL';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (formData.whatsIncluded.length === 0) {
      newErrors.whatsIncluded = 'At least one "What’s Included" option must be selected';
    }

    if (formData.whatsNotIncluded.length === 0) {
      newErrors.whatsNotIncluded = 'At least one "What’s Not Included" option must be selected';
    }

    if (formData.keyFeatures.length === 0) {
      newErrors.keyFeatures = 'At least one key feature must be selected';
    }

    if (formData.termsAndConditions.length === 0) {
      newErrors.termsAndConditions = 'At least one term and condition must be selected';
    }

    if (!formData.thingsToKeepInMind) {
      newErrors.thingsToKeepInMind = 'This field is required';
    }

    if (!formData.otherInformation) {
      newErrors.otherInformation = 'Other information is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If validation fails, don't submit the form
    }

    try {
      const response = await axios.post('http://localhost:5000/api/event-details', formData);
      alert('Event added successfully!');

      // Navigate to the details page with the response data
      navigate(`/details/${response.data.id}`, { state: { eventData: response.data } });
      
      // Reset form after submission
      setFormData({
        imagesUrl: '',
        eventType: '',
        whatsIncluded: [],
        whatsNotIncluded: [],
        keyFeatures: [],
        termsAndConditions: [],
        thingsToKeepInMind: '',
        otherInformation: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="d-flex">
      <Navigation />
      <div className="container mt-4" style={{ maxWidth: '900px' }}>
        <h2>Add Event Details</h2>
        <form onSubmit={handleSubmit}className="shadow p-4 rounded bg-white">
          

           {/* Things to Keep in Mind */}
           <div className="row mb-3">
            <label className="col-sm-3 col-form-label">Event name:</label>
            <div className="col-sm-9">
              <textarea
                name="thingsToKeepInMind"
                value={formData.thingsToKeepInMind}
                onChange={handleChange}
                
                required
                className={`form-control ${errors.thingsToKeepInMind ? 'is-invalid' : ''}`}
              />
              {errors.thingsToKeepInMind && <div className="invalid-feedback">{errors.thingsToKeepInMind}</div>}
            </div>
          </div>
          
          {/* Image URL */}
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">Image URL:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="imagesUrl"
                value={formData.imagesUrl}
                onChange={handleChange}
                required
                className={`form-control ${errors.imagesUrl ? 'is-invalid' : ''}`}
              />
              {errors.imagesUrl && <div className="invalid-feedback">{errors.imagesUrl}</div>}
            </div>
          </div>

          {/* Event Type */}
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">Event Type:</label>
            <div className="col-sm-9">
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className={`form-select ${errors.eventType ? 'is-invalid' : ''}`}
              >
                <option value="">Select...</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
              {errors.eventType && <div className="invalid-feedback">{errors.eventType}</div>}
            </div>
          </div>

          {/* Checkboxes for Included Items */}
          <div className="mb-3 border p-3 rounded">
            <h5>What's Included</h5>
            {['Guided Tour', 'Camping Gear', 'Meals Included', 'Parking'].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    name="whatsIncluded"
                    value={item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              </div>
            ))}
            {errors.whatsIncluded && <div className="text-danger">{errors.whatsIncluded}</div>}
          </div>

          {/* Checkboxes for Not Included Items */}
          <div className="mb-3 border p-3 rounded">
            <h5>What's Not Included</h5>
            {['Travel Insurance', 'Personal Expenses', 'Tent Rental'].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    name="whatsNotIncluded"
                    value={item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              </div>
            ))}
            {errors.whatsNotIncluded && <div className="text-danger">{errors.whatsNotIncluded}</div>}
          </div>

          {/* Checkboxes for Key Features */}
          <div className="mb-3 border p-3 rounded">
            <h5>Key Features</h5>
            {['Relaxation Areas: Designated spaces for yoga, meditation, or simply unwinding in nature, often equipped with hammocks or seating.', 'Play Areas for Kids: Safe and fun areas designed for children, with playground equipment and organized activities.', 'Team-building Activities: Organized games and challenges designed to promote teamwork and collaboration among campers.', 'Nature Journaling: Workshops focused on observing and documenting nature through writing, drawing, or photography.'].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    name="keyFeatures"
                    value={item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              </div>
            ))}
            {errors.keyFeatures && <div className="text-danger">{errors.keyFeatures}</div>}
          </div>

          {/* Checkboxes for Terms and Conditions */}
          <div className="mb-3 border p-3 rounded">
            <h5>Terms and Conditions</h5>
            {['All participants must arrive on time for scheduled activities.', 'Participants are responsible for their personal belongings and any equipment rented from the campsite.', 'Campers must follow all instructions given by guides and staff during activities.','Participants must adhere to all safety guidelines and regulations set by the camping site.','Participants must be in good health to participate in camping activities.'].map((item) => (
              <div key={item}>
                <label>
                  <input
                    type="checkbox"
                    name="termsAndConditions"
                    value={item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              </div>
            ))}
            {errors.termsAndConditions && <div className="text-danger">{errors.termsAndConditions}</div>}
          </div>

         

          {/* Other Information */}
          <div className="row mb-3">
            <label className="col-sm-3 col-form-label">Other Information:</label>
            <div className="col-sm-9">
              <textarea
                name="otherInformation"
                value={formData.otherInformation}
                onChange={handleChange}
                rows="4"
                required
                className={`form-control ${errors.otherInformation ? 'is-invalid' : ''}`}
              />
              {errors.otherInformation && <div className="invalid-feedback">{errors.otherInformation}</div>}
            </div>
          </div>

           {/* Submit Button */}
           <button type="submit" className="btn btn-primary w-100 fw-bold py-2"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
          }}>
            Add Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDetailsForm;
