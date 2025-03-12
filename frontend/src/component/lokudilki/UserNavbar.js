import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/supdetails/:id">My Profile</Link></li>
        <li><Link to="/orders">My Orders</Link></li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
