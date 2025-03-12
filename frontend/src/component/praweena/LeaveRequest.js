import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeaveRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState('');
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);

    // Fetch employee data
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
                setEmployee(res.data);
            } catch (err) {
                console.error('Error fetching employee data:', err);
                setError('Failed to fetch employee data');
            }
        };
        fetchEmployee();
    }, [id]);

    // Handle leave request submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employee || !reason) {
            setError("Please provide all required information");
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/leaves`, {
                employeeId: id,
                userName: employee.userName,
                reason,
                status: 'Pending'
            });
            navigate(`/EmployeeProfile/${id}`);
        } catch (error) {
            console.error('Error submitting leave request:', error);
            setError("Failed to submit leave request.");
        }
    };

    if (!employee) return <div style={{ textAlign: 'center', fontSize: '24px', color: '#06402B' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#06402B' }}>Leave Request</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Employee ID:</label>
                    <input type="text" value={id} disabled style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Username:</label>
                    <input type="text" value={employee.userName} disabled style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Reason:</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#06402B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Submit Leave Request
                </button>
            </form>
        </div>
    );
};

export default LeaveRequest;