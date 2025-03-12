import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import for table generation
import Navigation from './Navigation';

const GuideTable = () => {
    const [guides, setGuides] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentGuide, setCurrentGuide] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await axios.get('http://localhost:5000/TourGuid');
                setGuides(response.data);
            } catch (error) {
                const errorMessage = error.response
                    ? `Error: ${error.response.status} ${error.response.statusText}`
                    : 'Error fetching tour guides';
                setError(errorMessage);
                console.error('Error fetching tour guides:', error);
            }
        };

        fetchGuides();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            try {
                await axios.delete(`http://localhost:5000/TourGuid/${id}`);
                setGuides(guides.filter(guide => guide._id !== id));
            } catch (error) {
                const errorMessage = error.response
                    ? `Error: ${error.response.status} ${error.response.statusText}`
                    : 'Error deleting guide';
                setError(errorMessage);
                console.error('Error deleting guide:', error);
            }
        }
    };

    const handleEditClick = (guide) => {
        setCurrentGuide(guide);
        setModalVisible(true);
    };

    const handleUpdateGuide = async () => {
        if (currentGuide) {
            try {
                await axios.put(`http://localhost:5000/TourGuid/${currentGuide._id}`, currentGuide);
                setGuides(guides.map(guide => (guide._id === currentGuide._id ? currentGuide : guide)));
                setModalVisible(false);
            } catch (error) {
                const errorMessage = error.response
                    ? `Error: ${error.response.status} ${error.response.statusText}`
                    : 'Error updating guide';
                setError(errorMessage);
                console.error('Error updating guide:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentGuide(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleString(); // Converts to readable date string

        doc.text('Tour Guide Report', 14, 10);
        doc.text(`Date: ${dateStr}`, 170, 10, { align: 'right' });

        const tableColumn = ["First Name", "Last Name", "Contact Number", "Email", "Experience", "Specialties", "Skills"];
        const tableRows = [];

        guides.forEach(guide => {
            const guideData = [
                guide.firstName,
                guide.lastName,
                guide.contactNumber,
                guide.email,
                guide.experience,
                guide.specialties,
                guide.skills
            ];
            tableRows.push(guideData);
        });

        // Auto table to format data in table format
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save('TourGuideReport.pdf'); // Save the PDF
    };

    // Filter guides based on search term
    const filteredGuides = guides.filter(guide =>
        guide.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navigation />
            <div className="container mt-5">
                <h2 className="mb-4">Tour Guide Table</h2>

              
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search by First Name"
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

               
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-warning" onClick={generateReport}>
                        Generate Report
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Experience</th>
                            <th>Specialties</th>
                            <th>Skills</th>
                            <th>Specialties Count</th>
                            <th>Skills Count</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuides.length > 0 ? (
                            filteredGuides.map((guide) => (
                                <tr key={guide._id}>
                                    <td>{guide.firstName}</td>
                                    <td>{guide.lastName}</td>
                                    <td>{guide.contactNumber}</td>
                                    <td>{guide.email}</td>
                                    <td>{guide.experience}</td>
                                    <td>{guide.specialties}</td>
                                    <td>{guide.skills}</td>
                                    {/* Count of specialties and skills */}
                                    <td>{guide.specialties ? guide.specialties.split(',').length : 0}</td>
                                    <td>{guide.skills ? guide.skills.split(',').length : 0}</td>
                                    <td>
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleEditClick(guide)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(guide._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">No guides available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Modal for Editing Guide */}
                {modalVisible && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Tour Guide</h5>
                                    <button type="button" className="close" onClick={() => setModalVisible(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {currentGuide && (
                                        <form>
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="form-control"
                                                    value={currentGuide.firstName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="form-control"
                                                    value={currentGuide.lastName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    className="form-control"
                                                    value={currentGuide.contactNumber}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={currentGuide.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Experience</label>
                                                <input
                                                    type="text"
                                                    name="experience"
                                                    className="form-control"
                                                    value={currentGuide.experience}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Specialties</label>
                                                <input
                                                    type="text"
                                                    name="specialties"
                                                    className="form-control"
                                                    value={currentGuide.specialties}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Skills</label>
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    className="form-control"
                                                    value={currentGuide.skills}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </form>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleUpdateGuide}>
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideTable;
