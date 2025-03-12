import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeProfile = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [leaveRequest, setLeaveRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
                if (res.data) {
                    setEmployee(res.data);
                } else {
                    setError("Employee not found!");
                }
            } catch (error) {
                setError("Failed to fetch employee data");
            } finally {
                setLoading(false);
            }
        };

        const fetchLeaveRequest = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/leaves/${id}`);
                setLeaveRequest(res.data);
            } catch (err) {
                console.error("Error fetching leave request:", err);
            }
        };

        fetchEmployee();
        fetchLeaveRequest();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', fontSize: '24px', color: '#06402B' }}>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            {employee ? (
                <>
                    <h1 style={{ color: '#06402B' }}>{employee.fullName}'s Profile</h1>
                    <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                    <p><strong>User Name:</strong> {employee.userName}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Position:</strong> {employee.position}</p>
                    <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                    <p><strong>Date of Birth:</strong> {new Date(employee.DOB).toLocaleDateString()}</p>
                    <p><strong>Gender:</strong> {employee.gender}</p>
                    <p><strong>Address:</strong> {employee.address}</p>
                    <p><strong>Salary:</strong> {employee.salary !== undefined ? employee.salary : 'Not assigned'}</p>
                    {employee.photo && (
                        <img 
                            src={`http://localhost:5000/${employee.photo}`} 
                            alt="Employee" 
                            style={{ width: '150px', borderRadius: '8px' }} 
                        />
                    )}

                    {/* Leave Request Information */}
                    {leaveRequest && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Leave Request</h3>
                            <p><strong>Status:</strong> {leaveRequest.status}</p>
                            <p><strong>Reason:</strong> {leaveRequest.reason}</p>
                        </div>
                    )}

                    {/* Button Container for Right Alignment */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Link to={`/leave-request/${employee._id}`}>
                            <button style={{ padding: '10px 20px', backgroundColor: '#006400', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Request Leave
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div>Employee not found!</div>
            )}
        </div>
    );
};

export default EmployeeProfile;