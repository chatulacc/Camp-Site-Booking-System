import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <div>
      <nav id="sidebar" className="bg-dark text-white vh-100 p-3 position-fixed top-0 start-0">
        <h4 className="text-white mb-4"> Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/ad">
              <i className="bi bi-person-fill me-2"></i>
              Admin
            </Link>
          </li>
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
            <Link className="nav-link text-white" to="/p">
              <i className="bi bi-box2-fill me-2"></i>
              Packages
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/add">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Package
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/guids">
              <i className="bi bi-people-fill me-2"></i>
              Tour Guides
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/addt">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Tour Guide
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin">
              <i className="bi bi-calendar2-event me-2"></i>
              Event
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/addevent">
              <i className="bi bi-plus-circle me-2"></i>
              Add New Event
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin_booking">
              <i className="bi bi-book-half me-2"></i>
              Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/inqp">
              <i className="bi bi-book-half me-2"></i>
              inquary
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