import React from "react";

function NavbarComp() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg shadow" style={{ backgroundColor: "white" }}>
        <a className="navbar-brand font-weight-bold" href="#" style={{ color: "#1a421e" }}>
          CampZip
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ backgroundColor: "#1a421e" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link font-weight-bold" href="#" style={{ color: "#1a421e" }}>
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold" href="#" style={{ color: "#1a421e" }}>
                Booking
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold" href="#" style={{ color: "#1a421e" }}>
                Packages
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                Events & Activities
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                Tour Guides
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                Equipments
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold disabled" href="#" style={{ color: "#1a421e" }}>
                Payment
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavbarComp;
