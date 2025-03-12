import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Camplocation from "../component/Camplocation";
import Loader from "../component/Loader";
import Swal from "sweetalert2";
import moment from "moment";
import { DatePicker } from "antd";
import { Link } from "react-router-dom";
import NavigationUser from "./NavigationUser";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [camplocations, setcamplocations] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();

  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicatecamplocations, setduplicatecamplocations] = useState([]);
  const [selectedCamplocation, setSelectedCamplocation] = useState(null);
  const [bookingid, setBookingId] = useState(null);

  const [searchParams] = useSearchParams();
  const preselectedFromDate = searchParams.get("fromdate");
  const preselectedToDate = searchParams.get("todate");
  const camplocationId = searchParams.get("camplocationid");

  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (preselectedFromDate && preselectedToDate) {
      setfromdate(preselectedFromDate);
      settodate(preselectedToDate);
    }

    const fetchData = async () => {
      try {
        setloading(true);
        const response = await axios.get(
          "http://localhost:5000/api/camplocations/getallcamplocations"
        );
        setcamplocations(response.data.camplocations);
        setduplicatecamplocations(response.data.camplocations);

        if (camplocationId) {
          const selected = response.data.camplocations.find(
            (loc) => loc._id === camplocationId
          );
          if (selected) {
            setSelectedCamplocation(selected);
            const bookingResponse = await axios.get(
              "http://localhost:5000/api/bookings/getallbookings"
            );
            const relatedBooking = bookingResponse.data.bookings.find(
              (booking) =>
                booking.camplocationid === camplocationId &&
                booking.fromdate === preselectedFromDate &&
                booking.todate === preselectedToDate
            );

            if (relatedBooking) {
              setBookingId(relatedBooking._id);
            }
          }
        }
        setloading(false);
      } catch (error) {
        seterror(true);
        setloading(false);
      }
    };

    fetchData();
  }, [preselectedFromDate, preselectedToDate, camplocationId]);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format("DD-MM-YYYY");
      const endDate = dates[1].format("DD-MM-YYYY");

      setfromdate(startDate);
      settodate(endDate);

      const tempcamplocations = duplicatecamplocations.filter(
        (camplocation) => {
          let availability = true;
          if (camplocation.currentbookings.length > 0) {
            availability = camplocation.currentbookings.every((booking) => {
              const bookingStartDate = moment(booking.fromdate, "DD-MM-YYYY");
              const bookingEndDate = moment(booking.todate, "DD-MM-YYYY");
              return !(
                moment(startDate, "DD-MM-YYYY").isBetween(
                  bookingStartDate,
                  bookingEndDate,
                  undefined,
                  "[]"
                ) ||
                moment(endDate, "DD-MM-YYYY").isBetween(
                  bookingStartDate,
                  bookingEndDate,
                  undefined,
                  "[]"
                ) ||
                bookingStartDate.isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                ) ||
                bookingEndDate.isBetween(startDate, endDate, undefined, "[]") ||
                startDate === booking.fromdate ||
                endDate === booking.todate
              );
            });
          }
          return availability;
        }
      );

      setcamplocations(tempcamplocations);
    } else {
      setcamplocations(duplicatecamplocations);
    }
  }

  function filterBySearch() {
    const tempcamplocations = duplicatecamplocations.filter((camplocation) =>
      camplocation.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setcamplocations(tempcamplocations);
  }

  function filterByType(e) {
    settype(e);
    if (e !== "all") {
      const tempcamplocations = duplicatecamplocations.filter(
        (camplocation) => camplocation.type.toLowerCase() === e.toLowerCase()
      );
      setcamplocations(tempcamplocations);
    } else {
      setcamplocations(duplicatecamplocations);
    }
  }

  // Function to handle additional requirements button click
  function handleAdditionalRequirements() {
    navigate("/mainpage"); 
  }

  return (
    <div>
       <NavigationUser/>
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search camplocations"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="RV">RV</option>
            <option value="urban">Urban</option>
          </select>
        </div>
      </div>

      {/* Additional Requirements button below search bar */}
      <div className="row mt-3">
        <div className="col-md-12 text-right">
          <button className="btn btn-warning" onClick={handleAdditionalRequirements}>
            Additional Requirements
          </button>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          <>
            {selectedCamplocation && (
              <div className="col-md-9 mt-2">
                <Camplocation
                  camplocation={selectedCamplocation}
                  fromdate={fromdate}
                  todate={todate}
                  bookingid={bookingid}
                />
              </div>
            )}

            {camplocations.map((camplocation) => {
              if (camplocation._id !== selectedCamplocation?._id) {
                return (
                  <div className="col-md-9 mt-2" key={camplocation._id}>
                    <Camplocation
                      camplocation={camplocation}
                      fromdate={fromdate}
                      todate={todate}
                    />
                  </div>
                );
              }
              return null;
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Homescreen;
