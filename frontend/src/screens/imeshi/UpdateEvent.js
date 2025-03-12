import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../component/imeshi/Navigation';

export default function UpdateEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState('');
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [description2, setDescription2] = useState('');
    const [rentperday, setRentPerDay] = useState('');
    const [dateAdded, setDateAdded] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/getallevents/${id}`);
                const event = response.data;
                setImage(event.imageurls[0] || '');
                setEventName(event.eventName);
                setDescription(event.description);
                setDescription2(event.descript || '');
                setRentPerDay(event.rentperday);
                setDateAdded(event.dateAdded.split('T')[0]);
            } catch (error) {
                console.error('There was an error fetching the event:', error);
            }
        };

        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        const newErrors = {};
        if (!image) newErrors.image = 'Image URL is required';
        if (!eventName) newErrors.eventName = 'Event Name is required';
        if (!description) newErrors.description = 'Description is required';
        if (!rentperday) newErrors.rentperday = 'Rent Per Day is required';
        if (isNaN(rentperday) || rentperday <= 0) {
            newErrors.rentperday = 'Rent Per Day must be a positive number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updatedEvent = {
            imageurls: [image],
            eventName,
            description,
            descript: description2,
            rentperday,
            dateAdded: new Date(dateAdded).toISOString(),
        };

        try {
            await axios.put(`http://localhost:5000/api/events/updateevent/${id}`, updatedEvent);
            alert('Event updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating the event:', error.response?.data || error.message);
        }
    };

    return (
        <div className="content-container">
            <Navigation />
            <h1>Update Event</h1>
            <form onSubmit={handleSubmit} style={{ width: '80%', margin: '0 auto', padding: 0, overflowX: 'auto', marginLeft: '200px' }}>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                    {errors.image && <div className="text-danger">{errors.image}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="eventName" className="form-label">Event Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="eventName"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                    {errors.eventName && <div className="text-danger">{errors.eventName}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description2" className="form-label">Description 2</label>
                    <textarea
                        className="form-control"
                        id="description2"
                        value={description2}
                        onChange={(e) => setDescription2(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rentperday" className="form-label">Rent Per Day</label>
                    <input
                        type="number"
                        className="form-control"
                        id="rentperday"
                        value={rentperday}
                        onChange={(e) => setRentPerDay(e.target.value)}
                        required
                        min="0"
                    />
                    {errors.rentperday && <div className="text-danger">{errors.rentperday}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="dateAdded" className="form-label">Date Added</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateAdded"
                        value={dateAdded}
                        onChange={(e) => setDateAdded(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1a421e', color: 'white' }}>Update</button>
            </form>
        </div>
    );
}
