import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavigationUser from './NavigationUser';
import Footer from './Footer';

const InventoryUser = () => {
  const [inventoryItems, setInventoryItems] = useState([]); // Store inventory items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cart, setCart] = useState([]); // State for managing cart items
  const [selectedQuantities, setSelectedQuantities] = useState({}); // State to manage selected quantities
  const navigate = useNavigate(); // Initialize navigation

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory'); // Fetch inventory items
        setInventoryItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Handle quantity selection change for an item
  const handleQuantityChange = (itemId, quantity) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  // Add item to the cart and decrease the quantity from inventory
  const addToCart = async (item) => {
    const selectedQuantity = selectedQuantities[item._id] || 1; // Default quantity is 1

    if (selectedQuantity > item.quantity) {
      alert('Selected quantity exceeds available stock.');
      return;
    }

    try {
      // Make an API call to decrease the item quantity in the database
      const response = await axios.put(
        `http://localhost:5000/inventory/decrease-quantity/${item._id}`,
        { quantity: selectedQuantity }
      );

      // Update the cart state with selected item and quantity
      const itemInCart = cart.find((cartItem) => cartItem._id === item._id);

      if (itemInCart) {
        // If the item already exists in the cart, update the quantity
        setCart((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + selectedQuantity }
              : cartItem
          )
        );
      } else {
        // Otherwise, add the item to the cart
        setCart((prevCart) => [...prevCart, { ...item, quantity: selectedQuantity }]);
      }

      alert(`${item.itemName} (${selectedQuantity}) has been added to your cart!`);

      // Update the inventory quantity after adding the item to the cart
      setInventoryItems((prevItems) =>
        prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: response.data.quantity } : i
        )
      );
    } catch (error) {
      alert('Error adding item to cart: ' + error.response?.data?.message || error.message);
    }
  };

  // Navigate to the Cart page and pass the cart state
  const goToCart = () => {
    navigate('/cart', { state: { cart } });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div>
      <NavigationUser />

      <h2 className="text-center">Available Inventory</h2>
      <button onClick={goToCart} className="btn btn-primary float-end">
        <i className="fa fa-shopping-cart"></i> View Cart
      </button>
      <div className="row">
        {inventoryItems.map((item) => (
          <div key={item._id} className="col-md-4 mb-4">
            {/* Bootstrap card for each item */}
            <div className="card h-100">
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.itemName}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }} // Uniform image size
              />
              <div className="card-body">
                <h5 className="card-title">{item.itemName}</h5>
                <p className="card-text">Category: {item.category}</p>
                <p className="card-text">Available Quantity: {item.quantity}</p>
                <p className="card-text">Price: Rs.{item.price.toFixed(2)}</p>

                {/* Quantity input */}
                <label htmlFor={`quantity-${item._id}`}>Quantity: </label>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  id={`quantity-${item._id}`}
                  className="form-control mb-2"
                  value={selectedQuantities[item._id] || 1}
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                  style={{ width: '80px', display: 'inline-block' }}
                />

                {/* Add to Cart button */}
                <button
                  className="btn btn-success"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart <i className="fa fa-shopping-cart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default InventoryUser;
