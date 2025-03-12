import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';  // Assuming you're adding styles in an external CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Supplier'  // Default role
  });
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/authRoutes/register', formData);

      console.log(response.data.msg);
      // Show an alert on successful registration
      window.alert('Registration successful! You can now log in.');

      // Redirect to the login page
      navigate('/');
    } catch (err) {
      console.error("Error registering", err.response?.data || err.message);
      window.alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="register-title">Register</h2>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="register-input" 
          placeholder="Name" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="register-input" 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          className="register-input" 
          placeholder="Password" 
          required 
        />
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="register-select"
        >
          <option value="Supplier">Supplier</option>
          <option value="SupplierManager">Supplier Manager</option>
        </select>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
