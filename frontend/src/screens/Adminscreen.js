import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Loader from "../component/Loader";
import Error from "../component/Error";
import Navigation from "../component/Navigation";

function Adminscreen() {
  const [bookings, setBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await axios.get("http://localhost:5000/api/bookings/getallbookings");
        const reservationData = await axios.get(
          "http://localhost:5000/api/reservations/getallreservations"
        );

        setBookings(bookingData.data.bookings);
        setReservations(reservationData.data.reservations);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    // Try parsing date directly in different formats
    const parsedDate = moment(
      date,
      ["YYYY-MM-DD", "DD-MM-YYYY", moment.ISO_8601],
      true
    );

    // If parsed date is valid, format it
    if (parsedDate.isValid()) {
      return parsedDate.format("DD-MM-YYYY");
    } else {
      console.error("Invalid Date:", date); // Log invalid date for debugging
      return "Invalid Date";
    }
  };

  // Group both bookings and reservations by status for the PieChart
  const combinedData = [...bookings, ...reservations];
  const statusData = combinedData.reduce((acc, entry) => {
    const status = entry.status;
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusData).map((key) => ({
    name: key,
    value: statusData[key],
  }));

  const COLORS = ["#06402B", "#FAD006", "#FFBB28", "#FF8042"];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <Navigation />
        </div>

        <div className="col-md-9" style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
            Bookings
          </h3>
          {loading && <Loader />}
          {error && <Error message={error.message} />}

          {/* Table to display bookings and reservations */}
          <table
            className="table table-bordered table-hover table-striped"
            style={{ marginTop: "20px" }}
          >
            <thead className="bs thead-dark">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Camplocation</th>
                <th>From</th>
                <th>To</th>
                <th>Event Type</th>
                <th>Package</th>
                <th>Items</th>
                <th>Tour Guide</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.length &&
                combinedData.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry._id}</td>
                    <td>{entry.userid}</td>
                    <td>{entry.camplocation}</td>
                    {/* Handle both 'fromdate' and 'fromDate' fields */}
                    <td>
                      {entry.fromDate
                        ? formatDate(entry.fromDate)
                        : formatDate(entry.fromdate)}
                    </td>
                    {/* Handle both 'todate' and 'toDate' fields */}
                    <td>
                      {entry.toDate
                        ? formatDate(entry.toDate)
                        : formatDate(entry.todate)}
                    </td>
                    {/* Event Type */}
                    <td>{entry.event || "-"}</td>

                    {/* Package */}
                    <td>{entry.package ? entry.package: "-"}</td>

                    {/* Items (assuming items is an array) */}
                    <td>
                      {entry.items && entry.items.length > 0
                        ? entry.items.map((item, idx) => (
                            <span key={idx}>
                              {item.name} (x{item.count})
                            </span>
                          ))
                        : "-"}
                    </td>

                    {/* Tour Guide */}
                    <td>{entry.tourGuide || "No Tour Guide"}</td>
                    <td>{entry.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Centered Pie Chart */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "50px",
            }}
          >
            <h3>Booking Status Distribution</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminscreen;
