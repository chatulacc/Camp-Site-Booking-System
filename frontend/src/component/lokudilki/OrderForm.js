import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, supplierId } = location.state || { orderId: null, supplierId: null };
  const [notes, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!orderId || !supplierId) {
      alert('Order ID or Supplier ID is missing. Please try again.');
      return;
    }

    // Submit the order
    axios.post('http://localhost:5000/api/supplierOrder/', {
      supplierId,
      itemId: orderId,
      notes: notes,
    })
      .then(response => {
        console.log('Order placed:', response.data);
        // Redirect to supplier profile or a success page
        navigate('/ordertable'); // or replace with the supplier profile route
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('Error placing order, please try again.');
      });
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#28a745', // Green shade
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    resize: 'vertical', // Allows vertical resizing only
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    display: 'block',
    width: '100%',
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Order ID:</label>
          <input type="text" value={orderId} readOnly style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Supplier ID:</label>
          <input type="text" value={supplierId} readOnly style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Note:</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Enter any additional notes" 
            style={textareaStyle} 
          />
        </div>
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
