import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Navigation from './Navigation';

function AddPackage() {
  const [packageType, setPackageType] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [addedCount, setAddedCount] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Validation function
  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    if (!packageType.trim()) {
      formErrors.packageType = 'Package type is required';
      valid = false;
    }

    if (!name.trim()) {
      formErrors.name = 'Name is required';
      valid = false;
    }

    if (!price) {
      formErrors.price = 'Price is required';
      valid = false;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      formErrors.price = 'Price must be a positive number';
      valid = false;
    }

    if (!description.trim()) {
      formErrors.description = 'Description is required';
      valid = false;
    } else if (description.length < 10) {
      formErrors.description = 'Description must be at least 10 characters long';
      valid = false;
    }

    if (!addedCount) {
      formErrors.addedCount = 'Number of people is required';
      valid = false;
    } else if (isNaN(addedCount) || parseInt(addedCount) <= 0) {
      formErrors.addedCount = 'Number of people must be a positive number';
      valid = false;
    }

    if (!image) {
      formErrors.image = 'Image is required';
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // Reset success state on form submission

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(); // Create a new FormData object
    formData.append('packageType', packageType);
    formData.append('name', name);
    formData.append('price', parseFloat(price));
    formData.append('description', description);
    formData.append('addedCount', parseInt(addedCount));
    formData.append('image', image); // Append the image file

    try {
      const response = await fetch('http://localhost:5000/package', {
        method: 'POST',
        body: formData, // Send FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Package created successfully:', result);
        // Clear the form
        setPackageType('');
        setName('');
        setPrice('');
        setDescription('');
        setAddedCount('');
        setImage(null); // Clear the image
        setErrors({});
        setSuccess(true); // Show success message
      } else {
        const error = await response.json();
        console.error('Error creating package:', error);
        setErrors({ form: error.message });
        setSuccess(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      setErrors({ form: 'Network error. Please try again later.' });
      setSuccess(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
        <Navigation/>
          <h2>Add New Package</h2>

          {success && <Alert variant="success">Package created successfully!</Alert>}
          {errors.form && <Alert variant="danger">{errors.form}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="packageType">
              <Form.Label>Package Type</Form.Label>
              <Form.Control
                as="select"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                isInvalid={!!errors.packageType}
                required
                className="custom-focus-outline"
              >
                <option value="">Select package type</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Deluxe">Deluxe</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.packageType}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
                required
                className="custom-focus-outline"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                isInvalid={!!errors.price}
                required
                className="custom-focus-outline"
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={!!errors.description}
                required
                className="custom-focus-outline"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="addedCount">
              <Form.Label>Amount of people</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of people"
                value={addedCount}
                onChange={(e) => setAddedCount(e.target.value)}
                isInvalid={!!errors.addedCount}
                required
                className="custom-focus-outline"
              />
              <Form.Control.Feedback type="invalid">
                {errors.addedCount}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Package Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                isInvalid={!!errors.image}
                required
                className="custom-focus-outline"
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Package
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddPackage;
