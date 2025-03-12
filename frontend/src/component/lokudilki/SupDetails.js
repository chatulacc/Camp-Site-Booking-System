import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SupplierDetails = () => {
  const [supplier, setSupplier] = useState(null);
  const [orders, setOrders] = useState([]);
  const { id } = useParams(); // Getting the supplier ID from the URL

  useEffect(() => {
    // Fetch supplier details
    axios.get(`http://localhost:5000/api/supplier/${id}`)
      .then((res) => {
        setSupplier(res.data);
      })
      .catch(() => {
        console.log("Error fetching supplier details");
      });

    // Fetch orders for the supplier
    axios.get(`http://localhost:5000/api/supplier/${id}/orders`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });

  }, [id]);

  // Loading state
  if (!supplier) {
    return <div style={loadingStyle}>Loading supplier details...</div>;
  }

  // Supplier details table
  const TableItem = (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th style={thStyle}>Supplier Name</th>
            <td style={tdStyle}>{supplier.supplierName || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>ID</th>
            <td style={tdStyle}>{supplier.uniqueSupplierID || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Email</th>
            <td style={tdStyle}>{supplier.email || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Phone Number</th>
            <td style={tdStyle}>{supplier.phoneNumber || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Address</th>
            <td style={tdStyle}>{supplier.address || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Type of Goods</th>
            <td style={tdStyle}>{supplier.typeOfGoods || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Supply Capacity</th>
            <td style={tdStyle}>{supplier.supplyCapacity || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Bank Account Details</th>
            <td style={tdStyle}>{supplier.bankAccountDetails || 'N/A'}</td>
          </tr>
          <tr>
            <th style={thStyle}>Payment Terms</th>
            <td style={tdStyle}>{supplier.paymentTerms || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Supplier Detail</h1>
      <p style={descriptionStyle}>This is the full detail of the supplier</p>
      <hr style={dividerStyle} />
      {/* Render TableItem */}
      <div style={tableWrapperStyle}>{TableItem}</div>

      {/* Render orders associated with the supplier */}
      <div style={ordersContainerStyle}>
        <h2 style={ordersHeaderStyle}>Orders</h2>
        <ul style={ordersListStyle}>
          {orders.length > 0 ? orders.map(order => (
            <li key={order._id} style={orderItemStyle}>
              Order ID: {order._id} - Note: {order.notes}
            </li>
          )) : (
            <li>No orders found for this supplier.</li>
          )}
        </ul>
      </div>
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

const loadingStyle = {
  textAlign: 'center',
  fontSize: '1.5rem',
  marginTop: '20px',
};

const headerStyle = {
  fontSize: '2rem',
  color: '#333',
  textAlign: 'center',
  marginBottom: '10px',
};

const descriptionStyle = {
  textAlign: 'center',
  color: '#555',
  marginBottom: '20px',
};

const dividerStyle = {
  margin: '10px 0',
  border: '1px solid #ddd',
};

const tableWrapperStyle = {
  marginBottom: '20px',
};

const tableContainerStyle = {
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
};

const thStyle = {
  padding: '12px',
  backgroundColor: '#4c5f38',
  color: '#fff',
  textAlign: 'left',
};

const tdStyle = {
  padding: '12px',
  border: '1px solid #ddd',
};

const ordersContainerStyle = {
  marginTop: '20px',
};

const ordersHeaderStyle = {
  fontSize: '1.5rem',
  color: '#333',
};

const ordersListStyle = {
  listStyleType: 'none',
  padding: '0',
};

const orderItemStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  transition: 'background-color 0.3s',
};

export default SupplierDetails;
