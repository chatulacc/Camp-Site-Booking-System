import React, { useState } from 'react';
import axios from 'axios';
import Navigation from './NavigationInventory';

export default function AddItem() {
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [dateAdded, setDateAdded] = useState('');

  const [errors, setErrors] = useState({});  // To hold validation error messages

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!image) newErrors.image = "Image is required.";
    if (!itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!sku.trim()) newErrors.sku = "SKU is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!quantity || quantity <= 0) newErrors.quantity = "Quantity should be greater than 0.";
    if (!price || price < 500 || price > 5000) newErrors.price = "Price should be between 500 and 5000.";
    if (!supplier.trim()) newErrors.supplier = "Supplier is required.";
    if (!reorderLevel || reorderLevel < 0) newErrors.reorderLevel = "Reorder level cannot be negative.";
    if (!dateAdded) newErrors.dateAdded = "Date added is required.";

    setErrors(newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('itemName', itemName);
    formData.append('sku', sku);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('supplier', supplier);
    formData.append('reorderLevel', reorderLevel);
    formData.append('dateAdded', dateAdded);

    try {
      const response = await axios.post('http://localhost:5000/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Item added successfully:', response.data);
      setImage(null);
      setItemName('');
      setSku('');
      setCategory('');
      setQuantity('');
      setPrice('');
      setSupplier('');
      setReorderLevel('');
      setDateAdded('');
      setErrors({});
    } catch (error) {
      console.error('There was an error adding the item:', error.response?.data || error.message);
    }
  };

  return (
    <div >
       <div className="navigation">
        
        <Navigation/>
       </div>
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {errors.image && <div className="text-danger">{errors.image}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          {errors.itemName && <div className="text-danger">{errors.itemName}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="sku" className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          {errors.sku && <div className="text-danger">{errors.sku}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {errors.category && <div className="text-danger">{errors.category}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            min="500"
            max="5000"
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>


        <div className="mb-3">
          <label htmlFor="supplier" className="form-label">Supplier</label>
          <input
            type="text"
            className="form-control"
            id="supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
          {errors.supplier && <div className="text-danger">{errors.supplier}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="reorderLevel" className="form-label">Reorder Level</label>
          <input
            type="number"
            className="form-control"
            id="reorderLevel"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
          />
          {errors.reorderLevel && <div className="text-danger">{errors.reorderLevel}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="dateAdded" className="form-label">Date Added</label>
          <input
            type="date"
            className="form-control"
            id="dateAdded"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />
          {errors.dateAdded && <div className="text-danger">{errors.dateAdded}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  );
}





