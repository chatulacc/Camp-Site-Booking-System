import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditItem() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [item, setItem] = useState({
    image: '',
    itemName: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
    reorderLevel: '',
    dateAdded: ''
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inventory/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/inventory/${id}`, item);
      console.log('Item updated successfully:', response.data);
      navigate('/inventory');
    } catch (error) {
      console.error('There was an error updating the item:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="image"
            value={item.image}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            value={item.itemName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sku" className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            id="sku"
            value={item.sku}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={item.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={item.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={item.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="supplier" className="form-label">Supplier</label>
          <input
            type="text"
            className="form-control"
            id="supplier"
            value={item.supplier}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reorderLevel" className="form-label">Reorder Level</label>
          <input
            type="number"
            className="form-control"
            id="reorderLevel"
            value={item.reorderLevel}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateAdded" className="form-label">Date Added</label>
          <input
            type="date"
            className="form-control"
            id="dateAdded"
            value={item.dateAdded}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Item</button>
      </form>
    </div>
  );
}
