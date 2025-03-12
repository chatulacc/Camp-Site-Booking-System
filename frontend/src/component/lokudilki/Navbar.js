import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const navbarStyle = {
    width: '250px',
    flexShrink: 0,
    backgroundColor: '#000000', // Navbar background
    padding: '20px',
    minHeight: '100vh', // Full height
    position: 'fixed', // Fix navbar on the left side
    top: 0,
    left: 0,
    zIndex: 1000, // Ensure the navbar stays on top
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)', // Add shadow for depth
  };

  const headerStyle = {
    color: '#fff',
    marginBottom: '20px', // Space below the title
    fontSize: '1.5rem',
    fontWeight: '600',
  };

  const navListStyle = {
    listStyleType: 'none', // Remove default list styling
    padding: 0, // Remove default padding
  };

  const navItemStyle = {
    marginBottom: '15px', // Space between items
  };

  const navLinkStyle = {
    color: '#fff',
    textDecoration: 'none', // Remove underline from links
    fontSize: '1.1rem',
    transition: 'color 0.3s', // Smooth color transition on hover
  };

  const activeLinkStyle = {
    fontWeight: 'bold', // Make active link bold
    borderBottom: '2px solid #007bff', // Underline active link
  };

  const hoverLinkStyle = {
    color: '#007bff', // Change color on hover
  };

  return (
    <div style={{ display: 'flex', minHeight: '5vh' }}>
      <nav style={navbarStyle}>
        <h4 style={headerStyle}>Supplier Management System</h4>
        <ul style={navListStyle}>
          <li style={navItemStyle}>
            <Link
              to="/"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverLinkStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navLinkStyle.color)}
              className="nav-link active"
            >
              Home
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link
              to="/insert"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverLinkStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navLinkStyle.color)}
            >
              Add new Supplier
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link
              to="/supplierlist"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverLinkStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navLinkStyle.color)}
            >
              View Supplier
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link
              to="/place-order"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverLinkStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navLinkStyle.color)}
            >
              Orders
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link
              to="/contact"
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverLinkStyle.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navLinkStyle.color)}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
