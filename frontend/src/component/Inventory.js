import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF auto-table
import Navigation from './NavigationInventory';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        setInventoryItems(response.data);
      } catch (error) {
        setError('Error fetching inventory items');
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/inventory/${id}`);
        setInventoryItems((prevItems) => prevItems.filter((item) => item._id !== id));
      } catch (error) {
        setError('Error deleting item');
        console.error('Error deleting item:', error);
      }
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const timestamp = new Date().toLocaleString();

    // Footer function
    const addFooter = (pageNumber) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(100);
      const footerText = `Page ${pageNumber} of ${pageCount}`;
      doc.text(timestamp, margin, pageHeight - 10);
      doc.text(footerText, pageWidth - margin - doc.getTextWidth(footerText), pageHeight - 10);
    };

    const filteredItems = inventoryItems.filter((item) => {
      return (
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const tableData = filteredItems.map((item) => [
      item.itemName || 'Unnamed Item',
      item.sku || 'N/A',
      item.category || 'N/A',
      item.quantity !== undefined ? String(item.quantity) : 'N/A',
      `$${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}`,
      item.supplier || 'N/A',
      item.reorderLevel !== undefined ? String(item.reorderLevel) : 'N/A',
      item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A',
    ]);

    doc.autoTable({
      head: [['Item Name', 'SKU', 'Category', 'Quantity', 'Price', 'Supplier', 'Reorder Level', 'Date Added']],
      body: tableData,
    });

    addFooter(doc.internal.getNumberOfPages());
    doc.save(`Inventory_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  // Prepare chart data
  const getChartData = () => {
    const itemNames = inventoryItems.map((item) => item.itemName || 'Unnamed Item');
    const itemQuantities = inventoryItems.map((item) => item.quantity || 0);

    return {
      labels: itemNames,
      datasets: [
        {
          label: 'Quantity',
          data: itemQuantities,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (selectedItem) {
      try {
        await axios.put(`http://localhost:5000/inventory/${selectedItem._id}`, selectedItem);
        setInventoryItems((prevItems) =>
          prevItems.map((item) => (item._id === selectedItem._id ? selectedItem : item))
        );
        setShowModal(false);
        setSelectedItem(null);
      } catch (error) {
        setError('Error updating item');
        console.error('Error updating item:', error);
      }
    }
  };

  // Filter inventory items
  const filteredItems = inventoryItems.filter((item) =>
    [item.itemName, item.sku, item.category, item.supplier].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
   <div>
    <Navigation/>
     <div className="container mt-4">
      <h2 className="text-center">Inventory Management</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by item name, SKU, category, or supplier"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Reorder Level</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName || 'Unnamed Item'}</td>
              <td>{item.sku || 'N/A'}</td>
              <td>{item.category || 'N/A'}</td>
              <td>
                {item.quantity !== undefined ? item.quantity : 'N/A'}
                {item.quantity < 4 && (
                  <Alert variant="warning" className="mt-2">
                    Low stock! Please reorder.
                  </Alert>
                )}
              </td>
              <td>{`$${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}`}</td>
              <td>{item.supplier || 'N/A'}</td>
              <td>{item.reorderLevel !== undefined ? item.reorderLevel : 'N/A'}</td>
              <td>{item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}</td>
              <td>
                <Button variant="primary" size="sm">Update</Button>
                <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
   </div>
  );
}
