import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from 'aos';
// import 'aos/dist/aos.css'; 

// AOS.init({
//     duration: 1000
// });

function Camplocation({ camplocation, fromdate, todate, bookingid }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row bs" >
      <div className="col-md-4">
        <img
          src={camplocation.imageurls[0]}
          className="smallimg"
          alt={camplocation.name}
        />
      </div>
      <div className="col-md-7">
        <h1>{camplocation.name}</h1>
        <b>
          <p>Type: {camplocation.type}</p>
        </b>

        <div style={{ float: "right" }}>
          {fromdate && todate && bookingid ? (
            <Link
              to={`/book/${camplocation._id}/${fromdate}/${todate}/${bookingid}`}
            >
              <button className="btn btn-success m-2">Confirm Update</button>
            </Link>
          ) : (
            fromdate &&
            todate && (
              <Link to={`/book/${camplocation._id}/${fromdate}/${todate}`}>
                <button className="btn btn-primary m-2">Book now</button>
              </Link>
            )
          )}
          <button className="btn btn-primary" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{camplocation.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {camplocation.imageurls.map((url, index) => {
              return (
                <Carousel.Item key={index}>
                  {" "}
                  {/* Add a unique key here */}
                  <img
                    className="d-block w-100 bigimg"
                    src={url}
                    alt={`Slide ${index + 1}`} 
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>

          <p>{camplocation.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Camplocation;
