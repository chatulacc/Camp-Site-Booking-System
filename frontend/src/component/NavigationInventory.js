import React from 'react';
import { Link } from 'react-router-dom';


export default function Navigation() {
  return (
    <div>
      <nav id="sidebar" className="bg-dark text-white vh-100 p-3 position-fixed top-0 start-0">
        <h4 className="text-white mb-4">Inventory Manager</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/inventory">
              <i className="bi bi-box-seam me-2"></i>
              Inventory
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/add-item">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Item
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/new-order">
              <i className="bi bi-cart-plus me-2"></i>
              New Order
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/logout">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
