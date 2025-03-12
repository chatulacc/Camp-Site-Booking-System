import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AssignSalary() {
    const { id } = useParams();
    const [baseSalary, setBaseSalary] = useState('');
    const [overtime, setOvertime] = useState('');
    const [allowance, setAllowance] = useState('');
    const [tax, setTax] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/employees/${id}`)
            .then(res => {
                setBaseSalary(res.data.salary || ''); 
            })
            .catch(err => {
                console.error("Error fetching employee details:", err);
            });
    }, [id]);

    const validatePositiveNumber = (value) => {
        return value === '' || (/^\d*\.?\d*$/.test(value)); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!baseSalary) {
            setError("Base salary is required.");
            return;
        }

        const total = parseFloat(baseSalary) + (parseFloat(overtime) || 0) + (parseFloat(allowance) || 0);
        const taxAmount = (parseFloat(tax) || 0) / 100 * total;
        const netSalary = total - taxAmount;

        axios.put(`http://localhost:5000/api/employees/${id}`, { salary: netSalary })
            .then(() => {
                alert("Salary assigned successfully!");
            })
            .catch(err => {
                console.error(err);
                setError("Failed to assign salary.");
            });
    };

    const handleBaseSalaryChange = (e) => {
        const value = e.target.value;
        if (validatePositiveNumber(value)) {
            setBaseSalary(value);
        }
    };

    const handleOvertimeChange = (e) => {
        const value = e.target.value;
        if (validatePositiveNumber(value)) {
            setOvertime(value);
        }
    };

    const handleAllowanceChange = (e) => {
        const value = e.target.value;
        if (validatePositiveNumber(value)) {
            setAllowance(value);
        }
    };

    const handleTaxChange = (e) => {
        const value = e.target.value;
        if (validatePositiveNumber(value) && value >= 0 && value <= 100) {
            setTax(value);
        } else {
            setError("Tax must be between 0 and 100.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Assign Salary</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="baseSalary" className="form-label">Base Salary:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="baseSalary"
                        value={baseSalary}
                        onChange={handleBaseSalaryChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="overtime" className="form-label">Overtime:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="overtime"
                        value={overtime}
                        onChange={handleOvertimeChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="allowance" className="form-label">Allowance:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="allowance"
                        value={allowance}
                        onChange={handleAllowanceChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="tax" className="form-label">Tax Percentage (0-100):</label>
                    <input
                        type="number"
                        className="form-control"
                        id="tax"
                        value={tax}
                        onChange={handleTaxChange}
                    />
                </div>

                <div className="d-flex justify-content-between" style={{ maxWidth: '300px' }}>
                    <button 
                        type="submit" 
                        className="btn" 
                        style={{ backgroundColor: '#4c5f38', color: '#fff', width: '48%' }}>
                        Assign Salary
                    </button>
                    <Link 
                        to="/" 
                        className="btn btn-dark" 
                        style={{ width: '48%' }}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default AssignSalary;