import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditOrder() {
  const { orderId } = useParams(); // Get order ID from URL parameters
  const [orderDetails, setOrderDetails] = useState({
    items: [{ itemId: '', quantity: 1, supplier: '', notes: '' }],
  });
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory'); // Fetch inventory items
        setInventoryItems(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchOrderDetails();
    fetchInventoryItems();
  }, [orderId]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = orderDetails.items.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setOrderDetails({ ...orderDetails, items: newItems });
  };

  const addItem = () => {
    setOrderDetails({
      ...orderDetails,
      items: [...orderDetails.items, { itemId: '', quantity: 1, supplier: '', notes: '' }],
    });
  };

  const removeItem = (index) => {
    const newItems = orderDetails.items.filter((item, i) => i !== index);
    setOrderDetails({ ...orderDetails, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, orderDetails); // Update request to the backend
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <h4>Order Items</h4>
        {orderDetails.items.map((item, index) => (
          <div key={index} className="row mb-3">
            <div className="col-md-4">
              <label htmlFor={`itemId-${index}`} className="form-label">Select Item</label>
              <select
                className="form-select"
                id={`itemId-${index}`}
                name="itemId"
                value={item.itemId}
                onChange={(e) => handleItemChange(index, e)}
                required
              >
                <option value="">Choose...</option>
                {inventoryItems.map((inventoryItem) => (
                  <option key={inventoryItem._id} value={inventoryItem._id}>
                    {inventoryItem.name} (Supplier: {inventoryItem.supplier})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor={`quantity-${index}`} className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                id={`quantity-${index}`}
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                min="1"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor={`supplier-${index}`} className="form-label">Supplier</label>
              <input
                type="text"
                className="form-control"
                id={`supplier-${index}`}
                name="supplier"
                value={item.supplier}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Auto-filled or manual"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor={`notes-${index}`} className="form-label">Notes</label>
              <input
                type="text"
                className="form-control"
                id={`notes-${index}`}
                name="notes"
                value={item.notes}
                onChange={(e) => handleItemChange(index, e)}
                placeholder="Optional"
              />
            </div>
            <div className="col-md-2 d-flex align-items-end mt-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem(index)}
                disabled={orderDetails.items.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addItem}>
          Add Another Item
        </button>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Update Order</button>
        </div>
        <Link to="/view-orders" className="btn btn-link">Back to Orders</Link>
      </form>
    </div>
  );
}
