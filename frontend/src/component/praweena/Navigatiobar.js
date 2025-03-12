import React from 'react';
import { Link } from 'react-router-dom';

function Navigationbar() {
  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '200px',
      height: '100%',
    }}>
      <h4 style={{
        color: '#fff',
        marginBottom: '20px',
        textAlign: 'center',
      }}>Employee Manager</h4>
      <ul style={{
        listStyleType: 'none',
        padding: 0,
      }}>
        <li style={{ margin: '15px 0' }}>
          <Link className="nav-link" to="/dashbordp" style={{
            color: '#fff',
            marginBottom: '15px',
            textDecoration: 'none',
          }}>Dashboard</Link>
        </li>
        <li style={{ margin: '15px 0' }}>
          <Link className="nav-link" to="/employeelist" style={{
            color: '#fff',
            marginBottom: '15px',
            textDecoration: 'none',
          }}>Home</Link>
        </li>
        <li style={{ margin: '15px 0' }}>
          <Link className="nav-link" to="/insertemployee" style={{
            color: '#fff',
            marginBottom: '15px',
            textDecoration: 'none',
          }}>Add New</Link>
        </li>
        <li style={{ margin: '15px 0' }}>
          <a className="nav-link" href="#" style={{
            color: '#fff',
            marginBottom: '15px',
            textDecoration: 'none',
          }}>Logout</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navigationbar;