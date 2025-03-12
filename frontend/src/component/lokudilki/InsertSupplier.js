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
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    }}>
      <Navbar/>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>Supplier Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="supplierName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Supplier Name</label>
          <input
            type="text"
            id="supplierName"
            name="supplierName"
            onChange={handleChange}
            value={supplierData.supplierName}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.supplierName && <span style={{ color: 'red' }}>{errors.supplierName}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="uniqueSupplierID" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unique Supplier ID</label>
          <input
            type="text"
            id="uniqueSupplierID"
            name="uniqueSupplierID"
            onChange={handleChange}
            value={supplierData.uniqueSupplierID}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.uniqueSupplierID && <span style={{ color: 'red' }}>{errors.uniqueSupplierID}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={supplierData.email}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            onChange={handleChange}
            value={supplierData.phoneNumber}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.phoneNumber && <span style={{ color: 'red' }}>{errors.phoneNumber}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
          <input
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
            value={supplierData.address}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="typeOfGoods" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type of Goods</label>
          <input
            type="text"
            id="typeOfGoods"
            name="typeOfGoods"
            onChange={handleChange}
            value={supplierData.typeOfGoods}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.typeOfGoods && <span style={{ color: 'red' }}>{errors.typeOfGoods}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="supplyCapacity" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Supply Capacity</label>
          <input
            type="text"
            id="supplyCapacity"
            name="supplyCapacity"
            onChange={handleChange}
            value={supplierData.supplyCapacity}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.supplyCapacity && <span style={{ color: 'red' }}>{errors.supplyCapacity}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="bankAccountDetails" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bank Details</label>
          <input
            type="text"
            id="bankAccountDetails"
            name="bankAccountDetails"
            onChange={handleChange}
            value={supplierData.bankAccountDetails}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.bankAccountDetails && <span style={{ color: 'red' }}>{errors.bankAccountDetails}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="paymentTerms" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Terms</label>
          <input
            type="text"
            id="paymentTerms"
            name="paymentTerms"
            onChange={handleChange}
            value={supplierData.paymentTerms}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.paymentTerms && <span style={{ color: 'red' }}>{errors.paymentTerms}</span>}
        </div>

        <button type="submit" style={{
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default InsertSupplier;