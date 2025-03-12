import React, { useState, useEffect } from 'react';
import axios from "axios";
import EmployeeCard from './EmployeeCard';
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navigationbar from './Navigatiobar';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = employees.filter((employee) =>
            employee.userName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredEmployees(filtered);
    }, [searchQuery, employees]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees/")
            .then((res) => {
                setEmployees(res.data);
                setFilteredEmployees(res.data); // Initialize filtered employees
            })
            .catch(() => {
                console.log("Error while getting data");
            });
    }, []);

    // Function to generate PDF report of employee list
    const generatePDF = () => {
        const doc = new jsPDF();
        
        const logoBase64 = ''; // Base64 string of your JPEG logo
        const companyName = "Camp-Zip"; 
        const companyAddress = "No 123, Malabe, Srilanka"; 

        // Add logo to the PDF as a JPEG image
        doc.addImage(logoBase64, 'JPEG', 10, 10, 30, 30); 
        doc.setFontSize(16).setFont('helvetica', 'bold').text(companyName, 50, 20); 
        doc.setFontSize(12).setFont('helvetica', 'normal').text(companyAddress, 50, 30);
        doc.setDrawColor(0, 0, 0).setLineWidth(0.5).line(10, 40, 200, 40); 

        const tableColumn = ["Employee ID", "Full Name", "User Name", "Position", "Email", "Phone Number", "DOB", "Gender", "Address"];
        const tableRow = [];

        filteredEmployees.forEach((employee) => {
            const employeeData = [
                employee.employeeId,
                employee.fullName,
                employee.userName,
                employee.position,
                employee.email,
                employee.phoneNumber,
                employee.DOB,
                employee.gender,
                employee.address
            ];
            tableRow.push(employeeData);
        });

        doc.autoTable(tableColumn, tableRow, { startY: 45 }); 
        doc.save("employee.pdf");
    };

    const employeeList = employees.length === 0
        ? "No employees found!"
        : filteredEmployees.map((employee, index) => (
            <EmployeeCard key={index} employee={employee} />
        ));

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <Navigationbar/>
            <div style={{ margin: '20px 0' }}>
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                />
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={generatePDF}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#042805', 
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
                padding: '20px',
            }}>
                {employeeList}
            </div>
        </div>
    );
}

export default EmployeeList;