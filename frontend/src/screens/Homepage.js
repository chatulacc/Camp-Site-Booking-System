import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import NavigationUser from './NavigationUser';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div>
      <NavigationUser />
      
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center"
        style={{
          height: '100vh',
          backgroundImage: 'url(/images/camping-background.jpg)', // Update background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1
                style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#4c5f38', // Earthy green color
                  marginBottom: '20px',
                }}
              >
                Discover the World of Camping
              </h1>
              <p
                style={{
                  fontSize: '1.5rem',
                  color: '#666',
                  marginBottom: '20px',
                }}
              >
                Create unforgettable memories in the great outdoors
              </p>
              <Button
                variant="success"
                size="lg"
                style={{
                  marginTop: '20px',
                  backgroundColor: '#4c5f38',
                  borderColor: '#4c5f38',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3a4a2b'; // Hover effect
                  e.target.style.borderColor = '#3a4a2b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4c5f38'; // Restore original color on leave
                  e.target.style.borderColor = '#4c5f38';
                }}
              >
                Search By Map
              </Button>
            </Col>
            <Col md={6}>
              <img
                src="./home.jpg" // Update image path
                alt="Camping Adventure"
                className="img-fluid"
                style={{
                  borderRadius: '10px',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
