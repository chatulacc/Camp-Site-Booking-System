import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2'; // Import the Pie component
import 'bootstrap/dist/css/bootstrap.min.css';
 // Import your custom CSS file
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from './logo.jpg'; // import your logo here
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navigation from './Navigation';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

function Packages() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  // Function to fetch packages from the backend
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/package');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle select/deselect package
  const handleSelectPackage = (pkg) => {
    if (selectedPackages.includes(pkg._id)) {
      setSelectedPackages(selectedPackages.filter(id => id !== pkg._id));
    } else {
      setSelectedPackages([...selectedPackages, pkg._id]);
    }
  };

  // Handle select/deselect all packages
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(packages.map(pkg => pkg._id));
    }
    setSelectAll(!selectAll);
  };

  // Function to handle editing a package
  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setShowModal(true);
  };

  // Function to handle deleting a package
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/package/${id}`, {
        method: 'DELETE',
      });

      if (response.status !== 204) {
        throw new Error('Failed to delete package');
      }

      // Update local state to reflect deletion
      const updatedPackages = packages.filter(pkg => pkg._id !== id);
      setPackages(updatedPackages);
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setShowModal(false);
    setCurrentPackage(null);
  };

  // Function to handle saving changes to a package
  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/package/${currentPackage._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPackage),
      });

      if (!response.ok) {
        throw new Error('Failed to update package');
      }

      const updatedPackage = await response.json();
      setPackages(packages.map(pkg => (pkg._id === updatedPackage._id ? updatedPackage : pkg)));
      handleClose();
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  // Function to handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentPackage(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Generate PDF for selected packages
  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Add logo in circular shape
    doc.addImage(logo, 'PNG', 10, 10, 20, 20, '', 'FAST'); // Adjust the position & size accordingly

    // Add the date in the right upper corner
    doc.text(`Generated on: ${date}`, 150, 20);

    // Filter selected packages for PDF
    const selectedData = packages.filter(pkg => selectedPackages.includes(pkg._id));

    console.log("Selected Packages:", selectedPackages);
    console.log("Selected Data for PDF:", selectedData);

    // Check if any packages are selected
    if (selectedData.length === 0) {
      alert("No packages selected for PDF generation.");
      return;
    }

    // Generate the PDF content
    const tableColumn = ['Package Type', 'Name', 'Price', 'Description', 'People Added'];
    const tableRows = [];

    selectedData.forEach(pkg => {
      const pkgData = [
        pkg.packageType,
        pkg.name,
        pkg.price,
        pkg.description,
        pkg.addedCount,
      ];
      tableRows.push(pkgData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Adjust based on the position of logo/date
      styles: { fontSize: 10 },
    });

    doc.save('packages_report.pdf');
  };

  // Filter packages based on the search query
  const filteredPackages = packages.filter(pkg =>
    pkg.packageType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for the pie chart
  const packageTypeCounts = filteredPackages.reduce((acc, pkg) => {
    acc[pkg.packageType] = (acc[pkg.packageType] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(packageTypeCounts),
    datasets: [{
      data: Object.values(packageTypeCounts),
      backgroundColor: [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
      ],
    }],
  };

  return (
    <Container>
      <Navigation/>
      <h1 className="my-4">Packages</h1>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by package type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={generatePDF} className="mb-3">
          Generate PDF
        </Button>
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>#</th>
            <th>Package Type</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>People Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPackages.map((pkg, index) => (
            <tr key={pkg._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedPackages.includes(pkg._id)}
                  onChange={() => handleSelectPackage(pkg)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{pkg.packageType}</td>
              <td>{pkg.name}</td>
              <td>{pkg.price}</td>
              <td>{pkg.description}</td>
              <td>{pkg.addedCount}</td>
              <td>
                <Button
                  className="btn-custom-edit"
                  size="sm"
                  onClick={() => handleEdit(pkg)}
                >
                  Edit
                </Button>
                <Button
                  className="btn-custom-delete"
                  size="sm"
                  onClick={() => handleDelete(pkg._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPackage && (
            <Form onSubmit={handleSave}>
              <Form.Group controlId="packageType">
                <Form.Label>Package Type</Form.Label>
                <Form.Control
                  type="text"
                  name="packageType"
                  value={currentPackage.packageType}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentPackage.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={currentPackage.price}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={currentPackage.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Pie chart section */}
<div className="my-4">
  <h2>Package Distribution</h2>
  <div className="pie-chart-container" style={{ width: '300px', height: '300px', margin: '0 auto' }}>
    <Pie data={pieData} />
  </div>
</div>

    </Container>
  );
}

export default Packages;
