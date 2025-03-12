import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';
import Navigationbar from './Navigatiobar';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const Dashboard = () => {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [leaveStatus, setLeaveStatus] = useState({ pending: 0, accepted: 0, declined: 0 });
    const [genderData, setGenderData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeCountResponse = await axios.get('http://localhost:5000/api/employees/count');
                setEmployeeCount(employeeCountResponse.data.count);

                const leaveStatusResponse = await axios.get('http://localhost:5000/api/leaves/status');
                setLeaveStatus(leaveStatusResponse.data);

                const employeesResponse = await axios.get('http://localhost:5000/api/employees');
                const genderCount = {};

                employeesResponse.data.forEach(employee => {
                    const normalizedGender = employee.gender.toLowerCase().trim();
                    genderCount[normalizedGender] = (genderCount[normalizedGender] || 0) + 1;
                });

                setGenderData(genderCount);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const pieChartData = {
        labels: Object.keys(genderData).map(gender => gender.charAt(0).toUpperCase() + gender.slice(1)),
        datasets: [
            {
                label: 'Employee Gender Distribution',
                data: Object.values(genderData),
                backgroundColor: ['#FAD006', '#06402B'],
                hoverOffset: 4,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Gender Distribution of Employees' },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                    return `${value} (${percentage})`;
                },
                color: '#fff',
            },
        },
    };

    const dashboardContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#e0f7e0',
    };

    const cardStyle = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        flex: 1,
        minWidth: '300px',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
    };

    const loadingStyle = {
        textAlign: 'center',
        fontSize: '24px',
        color: '#06402B',
    };

    if (loading) {
        return <div style={loadingStyle}>Loading...</div>;
    }

    return (
        <div style={dashboardContainerStyle}>
            <Navigationbar/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Employee Dashboard</h2>
                <div>
                    <Link to="/Employeeprofile">
                        <button style={{ backgroundColor: '#06402b', color: 'white', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                            Profile
                        </button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h3>Total Employees</h3>
                    <p>{employeeCount}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Leave Requests</h3>
                    <p>Pending: {leaveStatus.pending}</p>
                    <p>Accepted: {leaveStatus.accepted}</p>
                    <p>Declined: {leaveStatus.declined}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Gender Distribution</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;