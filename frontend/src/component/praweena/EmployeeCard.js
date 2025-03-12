import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EmployeeCard({ employee }) {
    const [leaveRequest, setLeaveRequest] = useState(null);

    useEffect(() => {
        const fetchLeaveRequest = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/leaves/${employee._id}`);
                setLeaveRequest(res.data);
            } catch (err) {
                console.error("Error fetching leave request", err);
            }
        };
        fetchLeaveRequest();
    }, [employee._id]);

    const handleLeaveDecision = (status) => {
        axios.put(`http://localhost:5000/api/leaves/${leaveRequest._id}, { status }`)
            .then(() => {
                setLeaveRequest((prev) => ({ ...prev, status }));
            })
            .catch((err) => console.error("Error updating leave request", err));
    };

    const onDeleteClick = (id) => {
        axios.delete(`http://localhost:5000/api/employees/${id}`)
            .then(() => {
                window.alert('Employee deleted successfully!');
                window.location.reload();
            })
            .catch((err) => {
                console.log("Delete error", err);
            });
    };

    return (
        <div style={{ margin: '0px' }}>
            <Card sx={{ maxWidth: 500, border: '1px solid #ccc', borderRadius: '8px' }}> {/* Increased maxWidth to 500 */}
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        width="250"
                        image={employee.photo ? `http://localhost:5000/${employee.photo}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQce-xRLIV8WV0J5hcwtoI3CtjpPRvZ6Il1voes5m2KEKUCIFJ8tisEzsyKlSE3DwgGkvE&usqp=CAU"}
                        alt="Employee"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" style={{ color: '#06402b' }}>
                            {employee.fullName}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#555' }}>
                            {employee.employeeId}<br />
                            {employee.userName}<br />
                            {employee.position}<br />
                            {employee.email}<br />
                            {employee.phoneNumber}<br />
                            {employee.DOB}<br />
                            {employee.gender}<br />
                            {employee.address}<br />
                            Salary: {employee.salary !== undefined ? employee.salary : 'Not assigned'}
                        </Typography>
                    </CardContent>
                </CardActionArea>

                {leaveRequest && (
                    <CardContent>
                        <Typography variant="body2">
                            <strong>Leave Status:</strong> {leaveRequest.status || 'Pending'}<br />
                            <strong>Reason:</strong> {leaveRequest.reason}
                        </Typography>

                        {leaveRequest.status === 'Pending' && (
                            <div>
                                <Button
                                    onClick={() => handleLeaveDecision('Accepted')}
                                    variant="contained"
                                    color="success"
                                    style={{ margin: '5px' }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleLeaveDecision('Declined')}
                                    variant="contained"
                                    color="error"
                                    style={{ margin: '5px' }}
                                >
                                    Decline
                                </Button>
                            </div>
                        )}
                    </CardContent>
                )}

                <CardActions style={{ justifyContent: 'space-between' }}>
                    <Button
                        size="small"
                        style={{ backgroundColor: '#06402b', color: 'white', marginRight: '10px' }}
                        onClick={() => onDeleteClick(employee._id)}
                    >
                        Delete
                    </Button>
                    <Link className="btn btn-outline-warning mx-2" to={`/updatedetails/${employee._id}`}>
                        Update
                    </Link>
                </CardActions>
                <center>
                    <Link className="btn btn-outline-info mt-3 mb-3" to={`/assignsalary/${employee._id}`}>
                        Assign Salary
                    </Link>
                </center>
            </Card>
        </div>
    );
}

export default EmployeeCard;