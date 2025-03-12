import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../component/Loader";
import Error from "../component/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

function Bookingscreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [camplocation, setCamplocation] = useState();
  const [bookingId, setBookingId] = useState(null);
  const [previousTotalAmount, setPreviousTotalAmount] = useState(0);
  const navigate = useNavigate();
  const [totalamount, settototalamount] = useState(0);
  const {
    camplocationid,
    bookingid,
    fromdate: fromdateParam,
    todate: todateParam,
  } = useParams();

  const fromdate = moment(fromdateParam, "DD-MM-YYYY");
  const todate = moment(todateParam, "DD-MM-YYYY");
  const totaldays = todate.diff(fromdate, "days") + 1;

  useEffect(() => {
    if (bookingid) {
      setBookingId(bookingid);
    }

    const fetchCamplocation = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/camplocations/getcamplocationbyid",
          { camplocationid }
        );
        setCamplocation(response.data.camplocation);

        const rentPerDay = response.data.camplocation.rentperday || 0;
        const newTotalAmount = totaldays * rentPerDay;
        settototalamount(newTotalAmount);

        if (bookingid) {
          const bookingResponse = await axios.get(`/api/bookings/${bookingid}`);
          setPreviousTotalAmount(bookingResponse.data.totalamount || 0);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchCamplocation();
  }, [camplocationid, totaldays, bookingid]);

  async function onToken(token) {
    const bookingDetails = {
      camplocation,
      fromdate: fromdate.format("YYYY-MM-DD"),
      todate: todate.format("YYYY-MM-DD"),
      totalamount,
      totaldays,
      token,
    };

    try {
      setLoading(true);
      let result;

      if (bookingId) {
        bookingDetails.bookingId = bookingId;

        // Compare amounts and handle payment/refund logic
        if (totalamount > previousTotalAmount) {
          const difference = totalamount - previousTotalAmount;
          await Swal.fire({
            title: "Payment Required",
            text: `The total has increased. Please pay an additional amount of ${difference}`,
            icon: "info",
          });
        } else if (totalamount < previousTotalAmount) {
          const difference = previousTotalAmount - totalamount;
          await Swal.fire({
            title: "Refund Notice",
            text: `You will be refunded ${difference} within a few days.`,
            icon: "info",
          });
        }

        // Proceed to update the booking
        result = await axios.post("http://localhost:5000/api/bookings/updatebooking", bookingDetails);
        Swal.fire("Updated", "Booking updated successfully", "success").then(() => {
          navigate("/profile");
        });
      } else {
        // New booking
        result = await axios.post("http://localhost:5000/api/bookings/bookcamplocation", bookingDetails);
        Swal.fire("Congratulations", "Your camplocation has been booked successfully", "success").then(() => {
          navigate("/profile");
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdatedData = async () => {
    const bookingDetails = {
      camplocation,
      fromdate: fromdate.format("YYYY-MM-DD"),
      todate: todate.format("YYYY-MM-DD"),
      totalamount,
      totaldays,
      bookingId,
    };

    try {
      if (totalamount > previousTotalAmount) {
        const difference = totalamount - previousTotalAmount;
        await Swal.fire({
          title: "Payment Required",
          text: `The total has increased. Please pay an additional amount of ${difference}`,
          icon: "info",
        });
      } else if (totalamount < previousTotalAmount) {
        const difference = previousTotalAmount - totalamount;
        await Swal.fire({
          title: "Refund Notice",
          text: `You will be refunded ${difference} within a few days.`,
          icon: "info",
        });
      } else {
        await Swal.fire("No Change", "No payment or refund required", "info");
      }

      const result = await axios.post("http://localhost:5000/api/bookings/updatebooking", bookingDetails);
      Swal.fire("Updated", "Booking updated successfully", "success").then(() => {
        navigate("/profile");
      });
    } catch (error) {
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : camplocation ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{camplocation.name}</h1>
              <img src={camplocation.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name: </p>
                  <p>From Date: {fromdate.format("DD-MM-YYYY")}</p>
                  <p>To Date: {todate.format("DD-MM-YYYY")}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Sub Total</h1>
                  <hr />
                  <p>Total days: {totaldays}</p>
                  <p>Rent per day: {camplocation.rentperday}</p>
                  <p>Total Amount: {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                {!bookingId ? (
                  <StripeCheckout
                    amount={totalamount * 100}
                    token={onToken}
                    currency="LKR"
                    stripeKey="pk_test_51PupSZ2L6Flr4EhiWtmHHunZx1wS15dLLyfZGNKGyjwY4YlsSIBWx1vT1bGxGZbVT755AC7d2OfbMNQdf0ERd5Bx00UezCwFJx"
                  >
                    <button className="btn btn-primary">Continue to checkout</button>
                  </StripeCheckout>
                ) : (
                  <button className="btn btn-primary mr-2" onClick={handleUpdatedData}>
                    Confirm Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;