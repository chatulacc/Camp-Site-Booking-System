import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Navigationbar from './Navigatiobar';

function InsertEmployee() {
  const [employeeData, setEmployeeData] = useState({
    employeeId: '',
    fullName: '',
    userName: '',
    position: '',
    email: '',
    phoneNumber: '',
    DOB: '',
    gender: '',
    address: '',
    photo: null
  });

  const [errors, setErrors] = useState({});

  // Form validation logic
  const validateForm = () => {
    let formErrors = {};
    // Employee ID validation
    // ... (your existing validation code)

    // Full name validation
    if (!/^[A-Za-z\s]+$/.test(employeeData.fullName)) {
      formErrors.fullName = "Full name must contain only letters.";
    }

    // Username validation
    if (!/^[A-Za-z]+$/.test(employeeData.userName)) {
      formErrors.userName = "Username must contain only letters.";
    }

    // Phone number validation
    if (!/^07\d{8}$/.test(employeeData.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must start with '07' and contain 8 digits.";
    }

    // Email validation
    if (!/^[a-zA-Z]+@gmail\.com$/.test(employeeData.email)) {
      formErrors.email = "Email must follow the format 'letters@gmail.com'.";
    }

    // Address validation
    if (!/^[A-Za-z0-9\s,]+$/.test(employeeData.address)) {
      formErrors.address = "Address can only contain letters, numbers, and commas.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  // Handle file change for photo upload
  const handleFileChange = (e) => {
    setEmployeeData({ ...employeeData, photo: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      for (const key in employeeData) {
        formData.append(key, employeeData[key]); // Employee ID will be included here
      }

      axios.post("http://localhost:5000/api/employees/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        window.alert("Employee added successfully!");

        setEmployeeData({
          employeeId: '', // Reset after submission
          fullName: '',
          userName: '',
          position: '',
          email: '',
          phoneNumber: '',
          DOB: '',
          gender: '',
          address: '',
          photo: null
        });
        setErrors({});
      })
      .catch((error) => {
        console.error("There was an error uploading the employee!", error);
      });
    }
  };

  return (
    <div className="container mt-5">
      <Navigationbar/>
      <h2 className="mb-4">Employee Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-4 border rounded shadow-sm bg-success bg-opacity-25">
        {errors.employeeID && <p className="text-danger">{errors.employeeID}</p>}

        <div className="form-group mb-3">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="fullName"
            value={employeeData.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            name="userName"
            value={employeeData.userName}
            onChange={handleChange}
            required
          />
          {errors.userName && <p className="text-danger">{errors.userName}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            className="form-control"
            id="position"
            name="position"
            value={employeeData.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={employeeData.phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="DOB">Date of Birth:</label>
          <input
            type="date"
            className="form-control"
            id="DOB"
            name="DOB"
            value={employeeData.DOB}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="gender">Gender:</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={employeeData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="address">Address:</label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows="4"
            value={employeeData.address}
            onChange={handleChange}
            required
          ></textarea>
          {errors.address && <p className="text-danger">{errors.address}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="photo">Photo:</label>
          <input
            type="file"
            className="form-control-file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Submit</button>
      </form>
    </div>
  );
}

export default InsertEmployee;