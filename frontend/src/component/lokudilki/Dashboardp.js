import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboardp = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const dashboardStyle = {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  };

  const headerStyle = {
    marginBottom: '30px',
    fontSize: '2rem',
    color: '#333',
    fontWeight: '600',
  };

  const dashboardCardsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: '20px',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    width: '250px',
    margin: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    position: 'relative',
  };

  const cardHeaderStyle = {
    marginBottom: '10px',
    fontSize: '1.5rem',
    color: '#28a745',
  };

  const cardParagraphStyle = {
    color: '#555',
    fontSize: '1rem',
  };

  return (
    <div style={dashboardStyle}>
      <h2 style={headerStyle}>Supplier Management Dashboard</h2>
      <div style={dashboardCardsStyle}>
        {[
          { title: 'Add New Suppliers', path: '/insert', description: 'Add and manage suppliers in the system.' },
          { title: 'Suppliers List', path: '/supplierlist', description: 'Manage suppliers in the system.' },
          { title: 'Place Orders', path: '/place-order', description: 'Place new orders with suppliers.' },
          { title: 'Total Orders', path: '#', description: 'View all current and completed orders.' },
        ].map(({ title, path, description }) => (
          <div
            key={title}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'none';
            }}
            onClick={() => handleNavigation(path)}
          >
            <h3 style={cardHeaderStyle}>{title}</h3>
            <p style={cardParagraphStyle}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboardp;
