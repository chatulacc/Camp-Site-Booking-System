import React, { useState, useEffect } from "react";
import { Tabs, Tag, Input, Select } from "antd"; 
import { useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import Loader from "../component/Loader";
import Error from "../component/Error";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { Divider, Flex, Tag } from "antd";
import moment from "moment";
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const onChange = (key) => {
  console.log(key);
};

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const location = useLocation(); // Get location to access passed data
  const bookingDetails = location.state?.bookingDetails; // Access passed booking details
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      label: "Profile",
      children: (
        <div>
          <h1>My Profile</h1>
          <br />
          {/* Uncomment to display user details */}
          {/* <h1>Name : {user.name} </h1>
              <h1>Email : {user.email} </h1>
              <h1>isAdmin : {user.isAdmin ? 'YES' : 'NO'} </h1> */}
        </div>
      ),
    },
    {
      key: "2",
      label: "Bookings",
      children: <MyBookings bookingDetails={bookingDetails} />, // Pass booking details
    },
  ];

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default Profilescreen;

export function MyBookings({ bookingDetails }) {
  const [reservations, setReservations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState(""); // State for camp location search
  const [searchStatus, setSearchStatus] = useState(""); // State for status search
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Fetch bookings from the booking model
        const bookingsResponse = await axios.post(
          "http://localhost:5000/api/bookings/getbookingsbyuserid",
          {
            userid: "1111",
            //user._id
          }
        );

        // Fetch reservations from the reservation model
        const reservationsResponse = await axios.get("http://localhost:5000/api/reservations", {
          params: { userid: "1111" },
        });

        setBookings(bookingsResponse.data);
        setReservations(reservationsResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const combinedBookings = [
    ...bookings.map(booking => ({ ...booking, isReservation: false })),
    ...reservations.map(reservation => ({ ...reservation, isReservation: true }))
  ];

   // Filter bookings based on search input
   const filteredBookings = combinedBookings.filter((booking) => {
    return (
      (searchLocation ? booking.camplocation.toLowerCase().includes(searchLocation.toLowerCase()) : true) &&
      (searchStatus ? booking.status === searchStatus : true)
    );
  });
  
  async function cancelBooking(bookingid, camplocationid, isReservation = false) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          
          if (isReservation) {
            // Cancel reservation
            const reservationResponse = await axios.post("http://localhost:5000/api/reservations/cancelbooking", {
              bookingid,
            });
            console.log("Reservation cancellation response:", reservationResponse.data);
          } else {
            // Cancel booking from the booking model
            const bookingResponse = await axios.post("http://localhost:5000/api/bookings/cancelbooking", {
              bookingid,
              camplocationid,
            });
            console.log("Booking cancellation response:", bookingResponse.data);
          }
  
          setLoading(false);
          Swal.fire("Cancelled!", "Your booking has been cancelled.", "success").then(() => {
            window.location.reload(); // Reload page after cancellation
          });
        } catch (error) {
          console.log(error);
          setLoading(false);
          Swal.fire("Oops", "Something went wrong", "error");
        }
      }
    });
  }
  

  // Function to generate PDF report
const generateReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Booking Report", 10, 10);

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();
  const timeString = currentDate.toLocaleTimeString();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  doc.setFontSize(12);
  doc.text(`Downloaded by: ${user ? user.name : "Dilki"}`, 10, 30);
  doc.text(`Downloaded on: ${dateString} at ${timeString}`, 10, 40);

  const tableData = filteredBookings.map((booking) => [
    booking.camplocation,
    // Format fromDate only if it's not already in "DD-MM-YYYY"
    moment(booking.fromDate || booking.fromdate, "DD-MM-YYYY", true).isValid() ? 
      (booking.fromDate || booking.fromdate) : 
      moment(booking.fromDate || booking.fromdate).format("DD-MM-YYYY"), 
    // Format toDate only if it's not already in "DD-MM-YYYY"
    moment(booking.toDate || booking.todate, "DD-MM-YYYY", true).isValid() ? 
      (booking.toDate || booking.todate) : 
      moment(booking.toDate || booking.todate).format("DD-MM-YYYY"),
    booking.totalamount,
    booking.status === "cancelled" ? "Cancelled" : "Confirmed",
    booking.event || "No event booked",
    booking.package || "No package booked",
    booking.items && booking.items.length > 0
      ? booking.items.map(item => `${item.name} (Count: ${item.count})`).join(", ")
      : "No items booked",
    booking.tourGuide === "yes" ? "Yes" : "No tour guide booked"
  ]);

  doc.autoTable({
    head: [
      [
        "Camp Location",
        "CheckIn",
        "CheckOut",
        "Amount",
        "Status",
        "Event Type",
        "Package",
        "Items",
        "Tour Guide"
      ]
    ],
    body: tableData,
    startY: 50,
    columnStyles: {
      0: { cellWidth: 25 },  // Camp Location
      1: { cellWidth: 25 },  // CheckIn
      2: { cellWidth: 25 },  // CheckOut
      3: { cellWidth: 25 },  // Amount
      4: { cellWidth: 25 },  // Status
      5: { cellWidth: 30 },  // Event Type
      6: { cellWidth: 30 },  // Package
      7: { cellWidth: 40 },  // Items
      8: { cellWidth: 25 },  // Tour Guide
    },
    styles: {
      cellPadding: 2,
      fontSize: 10, // Adjusted font size for better visibility
      overflow: 'linebreak'  // Text wrapping for longer content
    },
    margin: { top: 50 },
  });

  doc.save("filtered_booking_report.pdf");
};


  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Search
          placeholder="Search by camp location"
          onChange={(e) => setSearchLocation(e.target.value)}
          style={{ width: 200, marginRight: "10px" }}
        />
        <Select
          placeholder="Filter by status"
          onChange={(value) => setSearchStatus(value)}
          style={{ width: 200 }}
          allowClear
        >
          <Option value="booked">Confirmed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>

        {/* Button to generate report */}
        <button className="btn btn-primary" onClick={generateReport} style={{ marginLeft: "10px" }}>
          Download Booking History
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div className="bs" key={booking._id}>
                <h1>{booking.camplocation}</h1>
                <p>
                    <b>Booking ID:</b> {booking._id}
                  </p>
                  <p>
                    <b>CheckIn:</b>{" "}
                    {booking.fromDate
                      ? moment(booking.fromDate).format("DD-MM-YYYY")
                      : booking.fromdate}
                  </p>
                  <p>
                    <b>CheckOut:</b>{" "}
                    {booking.toDate
                      ? moment(booking.toDate).format("DD-MM-YYYY")
                      : booking.todate}
                  </p>
                  <p>
                    <b>Amount:</b> {booking.totalamount}
                  </p>

                  {/* Additional details */}
                  <p>
                    <b>Event Type:</b> {booking.event || "No event booked"}
                  </p>
                  <p>
                    <b>Package:</b> {booking.package || "No package booked"}
                  </p>
                  <p>
                    <b>Items:</b>{" "}
                    {booking.items && booking.items.length > 0
                      ? booking.items
                          .map(
                            (item) =>
                              `Item: ${item.name} - Count: ${item.count}`
                          )
                          .join(", ")
                      : "No items booked"}
                  </p>
                  <p>
                    <b>Tour Guide:</b>{" "}
                    {booking.tourGuide === "yes"
                      ? "Yes"
                      : "No tour guide booked"}
                  </p>
                <p>
                  <b>Status:</b>{" "}
                  {booking.status === "cancelled" ? (
                    <Tag color="red">CANCELLED</Tag>
                  ) : (
                    <Tag color="green">CONFIRMED</Tag>
                  )}
                </p>

                {booking.status !== "cancelled" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          cancelBooking(booking._id, booking.camplocationid, booking.isReservation)
                        }
                      >
                        CANCEL BOOKING
                      </button>

                      <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (booking.isReservation) {
                        // Navigate to MainPage.js with current booking details
                        navigate('/update-reservation', {
                          state: {
                            bookingDetails: {
                              fromDate: booking.fromDate || booking.fromdate,
                              toDate: booking.toDate || booking.todate,
                              camplocation: booking.camplocation,
                              event: booking.event,
                              package: booking.package,
                              items: booking.items,
                              tourGuide: booking.tourGuide,
                              bookingId: booking._id
                            }
                          }
                        });
                      } else {
                        // Navigate to Homescreen.js for normal bookings
                        window.location.href = `/home?fromdate=${booking.fromdate}&todate=${booking.todate}&camplocationid=${booking.camplocationid}&bookingid=${booking._id}`;
                      }
                    }}
                  >
                    UPDATE BOOKING
                  </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <Error message="No bookings found" />
          )}
        </div>
      </div>
    </div>
  );
}