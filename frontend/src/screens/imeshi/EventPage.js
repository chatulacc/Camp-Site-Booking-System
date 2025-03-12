import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NavbarComp from "../../component/imeshi/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Event from "../../component/imeshi/Event"; // Import the Event component
import NavigationUser from "../NavigationUser";

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/events/getallevents");
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response ? error.response.data : error.message);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Function to filter and sort events based on search term and sorting option
    const getFilteredAndSortedEvents = useCallback(() => {
        return events
            .filter((event) => {
                const searchString = searchTerm.toLowerCase();
                return (
                    searchString === "" ||
                    event.eventName.toLowerCase().includes(searchString) ||
                    event.description.toLowerCase().includes(searchString)
                );
            })
            .sort((a, b) => {
                switch (sortOption) {
                    case "priceLowHigh":
                        return a.rentperday - b.rentperday;
                    case "priceHighLow":
                        return b.rentperday - a.rentperday;
                    case "recentlyAdded":
                        return new Date(b.dateAdded) - new Date(a.dateAdded);
                    default:
                        return 0;
                }
            });
    }, [events, searchTerm, sortOption]);

    const sortedEvents = getFilteredAndSortedEvents();

    return (
        <div>
            <NavigationUser />

            {/* Event showcase image */}
            <div className="mb-4">
                <img
                    src="/images/2024100720205862v.jpg"
                    alt="Event Showcase"
                    className="img-fluid w-100"
                    style={{ height: '250px', objectFit: 'cover' }}
                />
            </div>

            {/* Event list and filters */}
            <div className="container mt-4">
                <div className="row mb-4 align-items-center">
                    <div className="col-md-8">
                        <h1 style={{ fontSize: '1.5rem', textAlign: 'left' }}>Events and Activities</h1>
                        <p>
                            Embark on thrilling adventures with our travel marketplace where you can find a wide range of exciting activities such as hiking, water rafting, snorkeling, and more.
                        </p>
                        <h2 style={{ marginTop: '1rem' }}>Featured Experiences</h2>
                    </div>
                    <div className="col-md-4 text-end">
                        {/* Search input */}
                        <input
                            type="text"
                            placeholder="Search for activities..."
                            className="form-control mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Sort dropdown */}
                        <select
                            className="form-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sort by...</option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                            <option value="recentlyAdded">Recently Added</option>
                        </select>
                    </div>
                </div>

                {/* Event cards */}
                <div className="row">
                    {loading ? (
                        <div className="col-12 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="col-12 text-center">
                            <h1>Error loading events</h1>
                            <p>{error}</p>
                        </div>
                    ) : sortedEvents.length > 0 ? (
                        sortedEvents.map((event) => (
                            <div key={event._id} className="col-md-4 mb-4">
                                <Event event={event} /> {/* Use the Event component here */}
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <h3>No matching events found</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventPage;
