import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
const InsertSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    supplierName: '',
    uniqueSupplierID: '',
    email: '',
    phoneNumber: '',
    address: '',
    typeOfGoods: '',
    supplyCapacity: '',
    bankAccountDetails: '',
    paymentTerms: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({
      ...supplierData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!/^[A-Za-z\s]+$/.test(supplierData.supplierName)) {
      formErrors.supplierName = 'Supplier name must contain only letters.';
    }

    if (!/^SUP\d+$/.test(supplierData.uniqueSupplierID)) {
      formErrors.uniqueSupplierID = 'Supplier ID must start with "SUP" followed by numbers.';
    }

    if (!/\S+@\S+\.\S+/.test(supplierData.email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    if (!/^07\d{8}$/.test(supplierData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    }

    if (!/^[A-Za-z\s]+$/.test(supplierData.address)) {
      formErrors.address = 'Address must contain only letters.';
    }

    if (!/^[A-Za-z\s]+$/.test(supplierData.typeOfGoods)) {
      formErrors.typeOfGoods = 'Type of goods must contain only letters.';
    }

    if (!/^\d+$/.test(supplierData.supplyCapacity)) {
      formErrors.supplyCapacity = 'Supply capacity must contain only numbers.';
    }

    if (!/^[A-Za-z0-9\s\-\/\._]+$/.test(supplierData.bankAccountDetails)) {
      formErrors.bankAccountDetails = 'Bank details must contain only letters, numbers, and the following special characters: - / . _';
    }

    if (!/^[A-Za-z\s]+$/.test(supplierData.paymentTerms)) {
      formErrors.paymentTerms = 'Payment terms must contain only letters.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios.post('http://localhost:5000/api/supplier', supplierData).then(() => {
        setSupplierData({
          supplierName: '',
          uniqueSupplierID: '',
          email: '',
          phoneNumber: '',
          address: '',
          typeOfGoods: '',
          supplyCapacity: '',
          bankAccountDetails: '',
          paymentTerms: '',
        });
      });
    }
  };

  return (
    <div className="container mt-5">
      <Navbar/>
      <h2 className="text-center mb-4">Supplier Registration Form</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 border rounded">
        {Object.entries(supplierData).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key} className="font-weight-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={key.includes('Email') ? 'email' : key.includes('Phone') ? 'tel' : 'text'}
              className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
              id={key}
              name={key}
              onChange={handleChange}
              value={value}
            />
            {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
          </div>
        ))}
        <div className="form-group">
          <button type="submit" className="btn btn-success btn-block">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default InsertSupplier;