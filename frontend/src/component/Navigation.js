import React from 'react'
import {Link} from 'react-router-dom'

export default function navigation() {
  return (
    <div> <div>
    <nav id="sidebar" className="bg-dark text-white vh-100 p-3 position-fixed top-0 start-0">
      <h4 className="text-white mb-4">Booking Manager</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/admin">
            <i className="fas fa-boxes me-2"></i>
            Bookings
            </Link>
          
        </li>
        {/* <li className="nav-item">
         
            <i className="fas fa-plus-circle me-2"></i>
            Add New Item
          
        </li> */}
        {/* <li className="nav-item">
         
            <i className="fas fa-cart-plus me-2"></i>
            New Order
        
        </li> */}
        <li className="nav-item">
        
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
         
        </li>
      </ul>
    </nav>
  </div></div>
  )
}
