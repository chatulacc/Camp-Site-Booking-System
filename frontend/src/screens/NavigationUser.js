import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationUser = () => {
  // Retrieve user information from localStorage
  let user = JSON.parse(localStorage.getItem('currentUser'));

  // Logout function to clear user data and redirect to login
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4c5f38' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/homepage" style={navBrandStyle}>
          CampZip
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/homepage">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/booking">Booking</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/event">Event</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/inventoryUser">Items</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/guser">Tour Guide</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Packageni">Package</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/inqp">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/proo">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/logout">Logout</Link>
            </li>

            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa fa-user"></i> {user.name}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <Link className="dropdown-item" to="/profile">Profile</Link>
                  <button className="dropdown-item" onClick={logout}>Log out</button>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register"></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login"></Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Optional inline styling for the brand
const navBrandStyle = {
  fontWeight: 'bold',
  fontSize: '24px',
};

export default NavigationUser;
