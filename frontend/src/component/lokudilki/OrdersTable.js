import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch supplier orders from the API
    axios.get('http://localhost:5000/api/supplierOrder/')
      .then(response => {
        setOrders(response.data); // Set the orders data
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching orders.');
        setLoading(false);
        console.error('Error fetching orders:', error);
      });
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Supplier Orders</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td style={tdStyle}>{order._id}</td>
              <td style={tdStyle}>{order.status}</td>
              <td style={tdStyle}>{order.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Inline styles
const containerStyle = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  margin: '20px auto',
};

const headerStyle = {
  fontSize: '2rem',
  color: '#333',
  marginBottom: '20px',
  textAlign: 'center',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  backgroundColor: '#4c5f38',
  color: '#fff',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#fff',
  transition: 'background-color 0.3s ease',
};

const rowStyle = {
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
};

export default OrderTable;
