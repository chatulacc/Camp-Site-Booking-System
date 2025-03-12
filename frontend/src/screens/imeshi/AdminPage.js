import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../component/imeshi/Event';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddDetailsForm from './AddDetails';

export function AdminPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigate = useNavigate();

    // Fetch events from the API
    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/events/getallevents');
            setEvents(data);
            setFilteredEvents(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events based on the search term
    useEffect(() => {
        const results = events.filter(event => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                event.eventName.toLowerCase().includes(searchTermLower) ||
                event.description.toLowerCase().includes(searchTermLower) ||
                (event.descript ? event.descript.toLowerCase().includes(searchTermLower) : false)
            );
        });
        setFilteredEvents(results);
    }, [searchTerm, events]);

    // Handle input changes
    const handleInputChange = (e, index, field) => {
        const newEvents = [...events];
        newEvents[index][field] = e.target.value;
        setEvents(newEvents);
    };

    // Handle updating an event
    const handleUpdate = async (event) => {
        try {
            console.log('Updating event:', event);
            await axios.put(`http://localhost:5000/api/events/updateevent/${event._id}`, event);
            alert('Event updated successfully!');
            fetchEvents(); // Refresh the event list after updating
        } catch (error) {
            console.error('Error updating event:', error.response ? error.response.data : error.message);
            alert('Failed to update event. Please try again.');
        }
    };

    // Handle deleting an event
    const handleDelete = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/delete/${eventId}`);
            setEvents(events.filter((event) => event._id !== eventId));
            alert('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
        }
    };

    // Generate report function
    const generateReport = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Event ID', 'Event Name', 'Rent Per Day', 'Description']],
            body: filteredEvents.map(event => [event._id, event.eventName, event.rentperday, event.description]),
        });
        doc.save('filtered_events_report.pdf');
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Handle Add More for each event
    const handleAddMore = (event) => {
        setSelectedEvent(event);
        toggleModal();
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            <Navigation />
            <div className="table-container">
                <h1 className="page-title">Events and Activities</h1>
                <div className="actions">
                    <button
                        onClick={generateReport}
                        className="btn btn-generate-report btn-sm"
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#218838')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#28a745')}
                    >
                        Generate Report
                    </button>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Event ID</th>
                            <th>Event Name</th>
                            <th>Rent Per Day</th>
                            <th>Description</th>
                            <th>Description 2</th>
                            <th>Indoor</th>
                            <th>Outdoor</th>
                            <th>Event Images</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event, index) => (
                                <tr key={event._id}>
                                    <td>{event._id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={event.eventName}
                                            onChange={(e) => handleInputChange(e, index, 'eventName')}
                                            className="input-field"
                                            style={{ fontSize: '12px' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={event.rentperday}
                                            onChange={(e) => handleInputChange(e, index, 'rentperday')}
                                            min="0"
                                            className="input-field"
                                            style={{ fontSize: '12px' }}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={event.description}
                                            onChange={(e) => handleInputChange(e, index, 'description')}
                                            rows={3}
                                            className="textarea-field"
                                            style={{ fontSize: '12px' }}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={event.descript || ''}
                                            onChange={(e) => handleInputChange(e, index, 'descript')}
                                            rows={3}
                                            className="textarea-field"
                                            style={{ fontSize: '12px' }}
                                        />
                                    </td>
                                    <td className="text-center">{event.isIndoor ? 'indoor' : '—'}</td>
                                    <td className="text-center">{event.isOutdoor ? 'outdoor' : '—'}</td>
                                    <td>
                                        {event.image1 ? (
                                            <img src={event.image1} alt="Event Image 1" className="event-image-small" />
                                        ) : (
                                            <span>No Image 1</span>
                                        )}
                                        {event.image2 ? (
                                            <img src={event.image2} alt="Event Image 2" className="event-image-small" />
                                        ) : (
                                            <span>No Image 2</span>
                                        )}
                                    </td>
                                    <td className="action-buttons">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(event)}
                                            style={{ fontSize: '12px' }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(event._id)}
                                            style={{ fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleAddMore(event)}
                                            style={{ fontSize: '12px' }}
                                        >
                                            Add More Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="no-events">No events found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Modal for Adding Event Details */}
                {showModal && (
                    <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" style={{ fontSize: '14px' }}>
                                        Add Event Details for {selectedEvent ? selectedEvent.eventName : ''}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={toggleModal}></button>
                                </div>
                                <div className="modal-body">
                                    {selectedEvent && (
                                        <AddDetailsForm
                                            selectedEvent={selectedEvent}
                                            toggleModal={toggleModal}
                                            fetchEvents={fetchEvents}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
