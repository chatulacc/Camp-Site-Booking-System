import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const [suppliers, setSuppliers] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderDetails, setOrderDetails] = useState({ items: [] }); 
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch suppliers
    axios.get('http://localhost:5000/api/supplier')
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((error) => {
        console.log('Error fetching suppliers:', error);
      });

    // Fetch all orders
    axios.get('http://localhost:5000/api/order')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!selectedSupplier || !selectedOrder) {
      console.log('Please select both a supplier and an order.');
      return;
    }

    navigate('/order-form', {
      state: {
        supplierId: selectedSupplier,
        orderId: selectedOrder
      }
    });
  };

  const handleOrderSelection = (e) => {
    const orderId = e.target.value;
    setSelectedOrder(orderId);
    
    axios.get(`http://localhost:5000/api/order/${orderId}`)
      .then((response) => {
        setOrderDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '600px',
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

  const selectStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.2s ease-in-out',
  };

  const selectHoverStyle = {
    borderColor: '#28a745',
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
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  const orderDetailsStyle = {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Place Order</h2>
      <form onSubmit={handlePlaceOrder}>
        <div>
          <label style={labelStyle}>Select Supplier:</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            style={selectStyle}
            onMouseEnter={(e) => e.target.style.borderColor = selectHoverStyle.borderColor}
            onMouseLeave={(e) => e.target.style.borderColor = ''}
          >
            <option value="">Select Supplier</option>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.supplierName}
                </option>
              ))
            ) : (
              <option value="">No suppliers available</option>
            )}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Select Order:</label>
          <select
            value={selectedOrder}
            onChange={handleOrderSelection}
            style={selectStyle}
            onMouseEnter={(e) => e.target.style.borderColor = selectHoverStyle.borderColor}
            onMouseLeave={(e) => e.target.style.borderColor = ''}
          >
            <option value="">Select Order</option>
            {orders.length > 0 ? (
              orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order ID: {order._id} - Total Items: {order.items.length}
                </option>
              ))
            ) : (
              <option value="">No orders available</option>
            )}
          </select>
        </div>
        
        <div style={orderDetailsStyle}>
          <h3>Order Details</h3>
          {orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <div key={index}>
                <p>Item ID: {item.itemId}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Supplier: {item.supplier}</p>
              </div>
            ))
          ) : (
            <p>No items in the selected order.</p>
          )}
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
