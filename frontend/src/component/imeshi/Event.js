import React from "react";
import { Link } from 'react-router-dom';

function Event({ event }) {
  // Check if the imageurls array exists and has at least one image, otherwise use a fallback image
  const image = event.imageurls && event.imageurls.length > 0 ? event.imageurls[0] : "/images/default-event.jpg";

  return (
    <div className="card h-100">
      <img 
        src={image} 
        alt={event.eventName || "Event Image"} // Provide fallback alt text
        className="card-img-top" 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{event.eventName || "Event Name Unavailable"}</h5>
        <p className="card-text">
          {event.description ? event.description.substring(0, 100) + '...' : "No description available."}
        </p>
        <p className="card-text">
          Price: {event.rentperday ? `Rs ${event.rentperday}` : "Price not available"}
        </p>
        
        {/* Link to the user-side DetailPage */}
        <Link to={`/detail-page/${event._id}`}> {/* Use event._id instead of event.detailsId */}
          <button className="btn btn-primary" style={{ backgroundColor: '#4c5f38', borderColor: '#1a421e' }}>
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Event;
