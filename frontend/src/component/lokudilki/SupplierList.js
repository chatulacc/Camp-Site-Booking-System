import React, { useState, useEffect } from 'react';
import axios from "axios";
import SupplierCard from './SupplierCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from './Navbar';
 // Keep this for global styles if needed

const SupplierList = () => {
  const [supplier, setSupplier] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSupplier, setFilteredSupplier] = useState([]);
  
  const COLORS = ['#1B5E20', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#388E3C', '#2E7D32'];

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = supplier.filter(
      (supplier) =>
        supplier.supplierName.toLowerCase().startsWith(lowerCaseQuery) || 
        supplier.uniqueSupplierID.toLowerCase().startsWith(lowerCaseQuery) 
    );
    setFilteredSupplier(filtered);
  }, [searchQuery, supplier]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/supplier`)
      .then((res) => {
        setSupplier(res.data);
        setFilteredSupplier(res.data);
      })
      .catch(() => {
        console.log("Error while getting data");
      });
  }, []);

  // Prepare data for bar chart (typeOfGoods count)
  const barChartData = () => {
    const goodsCount = supplier.reduce((acc, curr) => {
      const goods = curr.typeOfGoods;
      acc[goods] = acc[goods] ? acc[goods] + 1 : 1;
      return acc;
    }, {});

    return Object.entries(goodsCount).map(([name, value]) => ({ name, value }));
  };

  const onDeleteClick = (id) => {
    axios.delete(`http://localhost:5000/api/supplier/${id}`)
      .then(() => {
        setSupplier(supplier.filter((supplier) => supplier._id !== id));
      })
      .catch((err) => {
        console.log("delete error", err);
      });
  };

  const generatePDF = () => {
    const pdf = new jsPDF();

    // Set up letterhead
    pdf.setFontSize(16);
    pdf.setFont("Arial", "bold");
    pdf.text("CampZip", 10, 10);
    pdf.setFontSize(12);
    pdf.setFont("Arial", "normal");
    pdf.text("CampZip, Ella", 10, 31);
    pdf.text("0710194533", 10, 38);

    // Add some space before the table
    pdf.setFontSize(14);
    pdf.text("Supplier List", 10, 50);

    // Table setup
    const tableColumn = [
      { header: "Supplier Name", dataKey: "supplierName" },
      { header: "Supplier ID", dataKey: "uniqueSupplierID" },
      { header: "Email", dataKey: "email" },
      { header: "Phone", dataKey: "phoneNumber" },
      { header: "Address", dataKey: "address" },
      { header: "Type of goods", dataKey: "typeOfGoods" },
      { header: "Supply capacity", dataKey: "supplyCapacity" },
      { header: "Bank details", dataKey: "bankAccountDetails" },
      { header: "Payment terms", dataKey: "paymentTerms" }
    ];

    const tableRows = filteredSupplier.map((supplier) => ({
      supplierName: supplier.supplierName,
      uniqueSupplierID: supplier.uniqueSupplierID,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address,
      typeOfGoods: supplier.typeOfGoods,
      supplyCapacity: supplier.supplyCapacity,
      bankAccountDetails: supplier.bankAccountDetails,
      paymentTerms: supplier.paymentTerms
    }));

    pdf.autoTable({
      startY: 55, 
      columns: tableColumn,
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, 
      styles: { fontSize: 10 },
      margin: { horizontal: 10 },
      columnStyles: {
        supplierName: { cellWidth: 30 },
        uniqueSupplierID: { cellWidth: 20 },
        email: { cellWidth: 40 },
        phoneNumber: { cellWidth: 20 },
        address: { cellWidth: 20 },
        typeOfGoods: { cellWidth: 10 },
        supplyCapacity: { cellWidth: 20 },
        bankAccountDetails: { cellWidth: 30 },
        paymentTerms: { cellWidth: 20 }
      }
    });

    // Save the PDF
    pdf.save("supplier.pdf");
  };

  const supplierList = filteredSupplier.length === 0
    ? "No supplier found!"
    : filteredSupplier.map((supplier) => (
        <SupplierCard key={supplier._id} supplier={supplier} onDelete={onDeleteClick} />
      ));

  return (
    <div className="show_SupplierList" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Navbar/>
      <div className="container">
        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '400px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }} 
          />
        </div>
        <div className="button" style={{ marginBottom: '20px' }}>
          <button onClick={generatePDF} style={{
            backgroundColor: '#4CAF50', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}>
            Download Report
          </button>
        </div>
        <div className="list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {supplierList}
        </div>

        {/* Bar chart to visualize the type of goods distribution */}
        <div className="chart-container" style={{ marginTop: '20px' }}>
          <h3>Supplier Goods Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={barChartData()}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" label={{ position: 'top' }}>
                {barChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
