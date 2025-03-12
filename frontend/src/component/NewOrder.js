import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Navigation from './NavigationInventory';

export default function NewInventoryOrderForm() {
  // Dummy data for existing inventory items. Replace with actual data fetching logic.
  const inventoryItems = [
    { id: '507f1f77bcf86cd799439011', name: 'Item 1', supplier: 'Supplier A' },
    { id: '507f1f77bcf86cd799439012', name: 'Item 2', supplier: 'Supplier B' },
    { id: '507f1f77bcf86cd799439013', name: 'Item 3', supplier: 'Supplier C' },
];


  const [orderDetails, setOrderDetails] = useState({
    items: [{ itemId: '', quantity: 1, supplier: '', notes: '' }],
  });

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = orderDetails.items.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setOrderDetails({
      ...orderDetails,
      items: newItems,
    });
  };

  const addItem = () => {
    setOrderDetails({
      ...orderDetails,
      items: [...orderDetails.items, { itemId: '', quantity: 1, supplier: '', notes: '' }],
    });
  };

  const removeItem = (index) => {
    const newItems = orderDetails.items.filter((item, i) => i !== index);
    setOrderDetails({
      ...orderDetails,
      items: newItems,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Order Details before submission:', orderDetails); // Logging order details
    try {
      // Update the endpoint here
      const response = await axios.post('http://localhost:5000/api/orders', orderDetails);
      console.log('Order Submitted:', response.data);
      alert('Order submitted successfully!');
      setOrderDetails({
        items: [{ itemId: '', quantity: 1, supplier: '', notes: '' }],
      });
    } catch (error) {
      // Improved error logging
      console.error('Error submitting order:', error.response ? error.response.data : error.message);
      alert('Error submitting order: ' + (error.response ? error.response.data.message : error.message));
    }
};


  return (
    
    <div className="container mt-5">
       <div className="navigation">
        
        <Navigation/>
       </div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>New Inventory Order</h2>
        <Link to="/view-orders">
          <button className="btn btn-info">View Orders</button>
        </Link>
      </div>

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
                  <option key={inventoryItem.id} value={inventoryItem.id}>
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
          <button type="submit" className="btn btn-primary">Submit Order</button>
        </div>
      </form>
    </div>
  );
}
