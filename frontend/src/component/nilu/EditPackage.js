import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditPackage() {
  const [packages, setPackages] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/package') // Consistent with the backend route
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPackages(data))
      .catch(error => console.error('Error fetching packages:', error));
  }, []);

  const handleEdit = (index) => {
    setCurrentPackage(packages[index]);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage({ ...currentPackage, [name]: value });
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/package/${currentPackage._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentPackage),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update package');
        }
        return response.json();
      })
      .then(updatedPackage => {
        const updatedPackages = [...packages];
        updatedPackages[editIndex] = updatedPackage; // Update the correct package in the state
        setPackages(updatedPackages); // Update the state with the new packages list
        setShowEditModal(false); // Close the modal only after successful update
      })
      .catch(error => {
        console.error('Error updating package:', error);
      });
  };

  const handleDelete = (index) => {
    const packageToDelete = packages[index];

    // Send the delete request to the backend
    fetch(`http://localhost:5000/package/${packageToDelete._id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete package');
        }
        // Remove the package from the state only after a successful delete
        const updatedPackages = packages.filter((_, i) => i !== index);
        setPackages(updatedPackages);
      })
      .catch(error => {
        console.error('Error deleting package:', error);
      });
  };

  return (
    <Container>
      <h1 className="my-4">Packages</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Package Type</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg._id}>
              <td>{index + 1}</td>
              <td>{pkg.packageType}</td>
              <td>{pkg.price}</td>
              <td>{pkg.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(index)}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Package Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="packageType">
              <Form.Label>Package Type</Form.Label>
              <Form.Control
                type="text"
                name="packageType"
                value={currentPackage.packageType || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentPackage.price || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentPackage.description || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditPackage;
