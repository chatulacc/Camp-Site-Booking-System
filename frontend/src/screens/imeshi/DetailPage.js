import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavbarComp from "../../component/imeshi/Navbar";

const DetailPage = () => {
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/getallevents/${id}`);
                setEventDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error}</h1>;

    return (
        <div>
            <NavbarComp />
            <div className="container mt-4">
                <h3 className="text-center" style={{ color: '#4c5f38', padding: '3px', borderRadius: '5px', margin: '0px' }}>
                    Event Details
                </h3>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card" style={{ border: '3px solid #4c5f38', backgroundColor: '#f8f9fa' }}>
                            <div className="text-center">
                                <img
                                    src={eventDetails.imageurls && eventDetails.imageurls.length > 0 ? eventDetails.imageurls[0] : '/images/default-event.jpg'} // Fallback image
                                    alt={eventDetails.eventName}
                                    className="rounded-circle mt-2"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body text-center">
                                <h5>{eventDetails.eventName}</h5>
                                <p>{eventDetails.description || "No description available"}</p>
                                <p><strong>Rent per day:</strong> Rs {eventDetails.rentperday || "N/A"}</p>
                                <p><strong>Added on:</strong> {new Date(eventDetails.dateAdded).toLocaleDateString()}</p>
                                <p><strong>Type:</strong> {eventDetails.isIndoor ? 'Indoor' : eventDetails.isOutdoor ? 'Outdoor' : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional event details on the right side */}
                    <div className="col-md-8">
                        <div className="card" style={{ border: '2px solid #4c5f38', backgroundColor: '#f8f9fa' }}>
                            <div className="card-body">
                                <h4>Event Information</h4>
                                <p>{eventDetails.descript || "No additional information available."}</p>
                                
                                <h5>Current Bookings</h5>
                                {eventDetails.currentbookings && eventDetails.currentbookings.length > 0 ? (
                                    <ul>
                                        {eventDetails.currentbookings.map((booking, index) => (
                                            <li key={index}>Booking by: {booking.user}, Date: {new Date(booking.date).toLocaleDateString()}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No current bookings.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
