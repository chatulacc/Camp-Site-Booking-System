import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout'; // Import Stripe
import axios from 'axios';
import Swal from 'sweetalert2'; // For alerts

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: initialCart } = location.state || { cart: [] };
  const [cart, setCart] = useState(initialCart);

  const stripeKey = "pk_test_51PupSZ2L6Flr4EhiWtmHHunZx1wS15dLLyfZGNKGyjwY4YlsSIBWx1vT1bGxGZbVT755AC7d2OfbMNQdf0ERd5Bx00UezCwFJx"; // Replace with your Stripe public key

  // Function to remove an item from the cart
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Function to handle Stripe token and payment
  const onToken = async (token) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate total
    const paymentDetails = {
      token,
      cart,
      totalamount: totalAmount, // Match the backend's expected 'totalamount'
    };

    try {
      // Send payment details to your server for processing
      const response = await axios.post('http://localhost:5000/api/payments/charge', paymentDetails); // Update URL

      if (response.status === 200) {
        // After successful payment, decrease the item quantities
        for (const item of cart) {
          await axios.put(`http://localhost:5000/inventory/decrease-quantity/${item._id}`, {
            quantity: item.quantity,
          });
        }

        Swal.fire("Payment Successful", "Your payment has been processed.", "success").then(() => {
          navigate("/profile"); // Redirect to profile or order confirmation
        });
      } else {
        Swal.fire("Payment Failed", response.data.message, "error");
      }
    } catch (error) {
      console.error("Payment Error: ", error); // Log error for debugging
     
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.itemName} - ${item.price.toFixed(2)} (Qty: {item.quantity})</span>
                <i
                  className="fa fa-trash text-danger"
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeItem(index)}
                  title="Remove from cart"
                ></i>
              </li>
            ))}
          </ul>

          {/* Stripe Checkout Button */}
          <div className="text-center mt-4">
            <StripeCheckout
              amount={cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100} // Convert to cents
              token={onToken} // Pass token to onToken function
              stripeKey={stripeKey}
              currency="USD"
              name="Your Shop"
            >
              <button className="btn btn-success">Rent Now</button>
            </StripeCheckout>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
