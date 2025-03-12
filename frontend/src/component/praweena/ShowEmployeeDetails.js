// src/components/ShowEmployeeDetails.js

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ShowEmployeeDetails() {
    const [employee, setEmployee] = useState(null); // Hold a single employee object
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/employees/${id}`) // Use backticks for template literals
            .then((res) => {
                setEmployee(res.data);
            })
            .catch((err) => {
                console.error("Error fetching employee details:", err);
            });
    }, [id]);

    if (!employee) {
        return <div style={{ textAlign: 'center', fontSize: '24px', color: '#06402B' }}>Loading...</div>; // Loading state
    }

    const TableItem = (
        <div>
            <table className="table table-hover table-dark" style={{ width: '100%', margin: '20px auto', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <th>ID</th>
                        <td>{employee.employeeId}</td> {/* Correctly display employeeID */}
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <th>Full Name</th>
                        <td>{employee.fullName}</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <th>Username</th>
                        <td>{employee.userName}</td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <th>Position</th>
                        <td>{employee.position}</td>
                    </tr>
                    <tr>
                        <th scope="row">5</th>
                        <th>Email</th>
                        <td>{employee.email}</td>
                    </tr>
                    <tr>
                        <th scope="row">6</th>
                        <th>Phone Number</th>
                        <td>{employee.phoneNumber}</td>
                    </tr>
                    <tr>
                        <th scope="row">7</th>
                        <th>Date of Birth</th>
                        <td>{employee.DOB}</td>
                    </tr>
                    <tr>
                        <th scope="row">8</th>
                        <th>Gender</th>
                        <td>{employee.gender}</td>
                    </tr>
                    <tr>
                        <th scope="row">9</th>
                        <th>Address</th>
                        <td>{employee.address}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <div className="showEmployeeDetails" style={{ marginBottom: '20px' }}>
                <Link to={"/employeelist"} className='btn btn-outline-danger float-right' style={{ marginTop: '10px' }}>Back to main</Link>
            </div>

            <div className="col-md-8 m-auto" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06402B' }}>Employee Details</h1>
                <p style={{ color: '#555', fontSize: '1.2rem' }}>This is full details of employee</p>
                <hr style={{ border: '1px solid #06402B' }} />
            </div>

            <div className="col-md-10 m-auto">
                {TableItem}
            </div>
        </div>
    );
}

export default ShowEmployeeDetails;