import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function UpdateEmployee() {
  const [employee, setEmployee] = useState({
    employeeID: '', // Assuming this is fetched from the database
    fullName: '',
    userName: '',
    position: '',
    email: '',
    phoneNumber: '',
    DOB: '',
    gender: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/employees/${id}`)
      .then((res) => {
        if (res.data) {
          setEmployee({
            employeeID: res.data.employeeId || '',
            fullName: res.data.fullName || '',
            userName: res.data.userName || '',
            position: res.data.position || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
            DOB: res.data.DOB || '',
            gender: res.data.gender || '',
            address: res.data.address || ''
          });
        }
      })
      .catch((err) => {
        console.log("Error from UpdateEmployee", err);
      });
  }, [id]);

  const validateForm = () => {
    let formErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z]+@gmail\.com$/;
    const phoneRegex = /^07\d{8}$/;
    const addressRegex = /^[A-Za-z0-9\s,]+$/;

    if (!nameRegex.test(employee.fullName)) {
      formErrors.fullName = "Full Name must contain only letters.";
    }

    if (!nameRegex.test(employee.userName)) {
      formErrors.userName = "Username must contain only letters.";
    }

    if (!nameRegex.test(employee.position)) {
      formErrors.position = "Position must contain only letters.";
    }

    if (!emailRegex.test(employee.email)) {
      formErrors.email = "Email must follow the format 'letters@gmail.com'.";
    }

    if (!phoneRegex.test(employee.phoneNumber)) {
      formErrors.phoneNumber = "Phone Number must start with '07' and contain 8 digits.";
    }

    if (!addressRegex.test(employee.address)) {
      formErrors.address = "Address can only contain letters, numbers, and commas.";
    }

    return formErrors;
  };

  const onChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      axios
        .put(`http://localhost:5000/api/employees/${id}`, employee)
        .then(() => {
          window.alert('Employee updated successfully!');
          navigate(`/showdetails/${id}`);
        })
        .catch((err) => {
          console.log("Error in update", err);
        });
    } else {
      setErrors(formErrors);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8em',
  };

  return (
    <div>
      <div className="UpdateEmployee">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <br />
              <Link to="/employeelist" className="btn btn-outline-warning float-left">
                Show Employee List
              </Link>
            </div>
          </div>
          <div className="col-md-8 m-auto">
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  type="text"
                  placeholder="Employee ID"
                  name="employeeID"
                  style={inputStyle}
                  value={employee.employeeID}
                  readOnly
                />
                {errors.employeeId && <p style={errorStyle}>{errors.employeeId}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  style={inputStyle}
                  value={employee.fullName}
                  onChange={onChange}
                />
                {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  placeholder="User Name"
                  name="userName"
                  style={inputStyle}
                  value={employee.userName}
                  onChange={onChange}
                />
                {errors.userName && <p style={errorStyle}>{errors.userName}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  placeholder="Position"
                  name="position"
                  style={inputStyle}
                  value={employee.position}
                  onChange={onChange}
                />
                {errors.position && <p style={errorStyle}>{errors.position}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  style={inputStyle}
                  value={employee.email}
                  onChange={onChange}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  style={inputStyle}
                  value={employee.phoneNumber}
                  onChange={onChange}
                />
                {errors.phoneNumber && <p style={errorStyle}>{errors.phoneNumber}</p>}
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="DOB">Date of Birth</label>
                <input
                  type="date"
                  name="DOB"
                  style={inputStyle}
                  value={employee.DOB}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  name="gender"
                  style={inputStyle}
                  value={employee.gender}
                  onChange={onChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  style={inputStyle}
                  value={employee.address}
                  onChange={onChange}
                />
                {errors.address && <p style={errorStyle}>{errors.address}</p>}
              </div>
              <br />
              <button type="submit" className="btn btn-outline-info btn-lg btn-block">
                Update Employee
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateEmployee;