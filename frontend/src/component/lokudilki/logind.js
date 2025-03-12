import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode'; // Corrected the import

const Logind = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [supplier, setSupplier] = useState([]);
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();

  // Fetch supplier data
  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/supplier`);
        setSupplier(res.data);
        console.log("Supplier data fetched: ", res.data); // Debug log for supplier data
      } catch (error) {
        console.log("Error while getting supplier data");
      }
    };

    fetchSupplierData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password }); // Debugging log
  
    try {
      const response = await axios.post('http://localhost:5000/api/authRoutes/login', { email, password });
      const token = response.data.token;
  
      // Save token to localStorage
      localStorage.setItem('token', token);
      console.log("Token saved to localStorage: ", token); // Debug log for token
  
      const decodedToken = jwtDecode(token);
      console.log("Decoded token: ", decodedToken); // Log entire decoded token
  
      const userRole = decodedToken.role;
  
      // Check if the logged-in user's email matches any supplier's email in the database
      const matchingSupplier = supplier.find(s => s.email === email);
  
      if (matchingSupplier) {
        setUserId(matchingSupplier._id);
        console.log("Matching supplier found: ", matchingSupplier); // Debug log
  
        // Redirect to the show details page using the matching supplier's ID
        navigate(`/supdetails/${matchingSupplier._id}`);
      } else {
        console.log("No matching supplier found for email: ", email); // Log if no supplier is found
      }
  
      // Redirect based on the user's role if no supplier is matched
      if (userRole === 'SupplierManager') {
        navigate('/dashboard');  // Redirect to SupplierList.js
      }
  
    } catch (err) {
      console.error("Error logging in", err.response?.data || err.message);
    }
  };

  // Inline styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    backgroundImage: 'url("path_to_your_image.jpg")', // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    maxHeight: '100vh',
    overflowY: 'auto',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4c5f38',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const linkStyle = {
    marginBottom: '15px',
    color: '#4c5f38',
    textDecoration: 'none'
  };

  return (
    <div>
      <Navbar />
      <Link
              to="/l"
            >
             
            </Link>
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleLogin}>
          <h2 style={titleStyle}>Login</h2>
          <input 
            id="login-email" 
            style={inputStyle}
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <input 
            id="login-password" 
            style={inputStyle}
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <Link to="/Register" style={linkStyle}>
            <p>Don't have an account? Register here</p>
          </Link>
          <button id="login-button" style={buttonStyle} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Logind;
