import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import moment from "moment";

function ReservationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data; // Access the passed data

  // Check if data is undefined
  if (!data) {
    return <div>Error: No reservation data available.</div>;
  }

  const stripeKey =
    "pk_test_51PupSZ2L6Flr4EhiWtmHHunZx1wS15dLLyfZGNKGyjwY4YlsSIBWx1vT1bGxGZbVT755AC7d2OfbMNQdf0ERd5Bx00UezCwFJx";

  async function onToken(token) {
    const bookingDetails = {
      fromdate: moment(data.fromDate).format("DD-MM-YYYY"), // Format date
      todate: moment(data.toDate).format("DD-MM-YYYY"),
      todate: data.toDate,
      totalamount: data.totalamount,
      event: data.event,
      package: data.package,
      items: data.items,
      numberOfItems: data.numberOfItems,
      tourGuide: data.tourGuide,
      // You may need to include additional fields if necessary
      token,
    };

    try {
      // Make an API request to process the payment
      const response = await fetch("http://localhost:5000/api/reservations/payments/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the booking data in the database after successful payment
        await storeReservationInDB(data);

        Swal.fire(
          "Payment Successful",
          "Your payment has been processed.",
          "success"
        ).then(() => {

          const bookingDetails = {
            camplocation: data.camplocation,
            fromdate: moment(data.fromDate).format("DD-MM-YYYY"), // Format date
            todate: moment(data.toDate).format("DD-MM-YYYY"),
            totalamount: data.totalamount,  // Make sure totalamount is included
            event: data.event,
            package: data.package,
            items: data.items,
            numberOfItems: data.numberOfItems,
            tourGuide: data.tourGuide,
          };

          navigate("/profile", { state: { bookingDetails } }); // Pass booking details
        });
      } else {
        Swal.fire("Payment Failed", result.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Something went wrong while processing your payment.",
        "error"
      );
    }
  }

  // Function to store reservation in the database
  async function storeReservationInDB(data) {
    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Reservation stored in DB");
      } else {
        const errorData = await response.json();
        console.error("Error storing reservation:", errorData.error);
      }
    } catch (error) {
      console.error("Error storing reservation:", error);
    }
  }

  return (
    <div>
      <style>{`
        .details-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f8ff;
        }

        .details-box {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        .details-box h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .details-box p {
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
          font-size: 16px;
        }

        .details-box span {
          color: #555;
        }

        .details-box button {
          width: 100%;
          background-color: #4c5f38;
          color: #fff;
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }

        .details-box button:hover {
          background-color: #218838;
        }
      `}</style>

      <div className="details-container">
        <div className="details-box">
          <h2>Reservation Details</h2>
          <p>
            Camp Location: <span>{data.camplocation}</span>
          </p>
          <p>
            From Date: <span>{moment(data.fromDate).format("DD-MM-YYYY")}</span> {/* Format date */}
          </p>
          <p>
            To Date: <span>{moment(data.toDate).format("DD-MM-YYYY")}</span> {/* Format date */}
          </p>
          <p>
            Event: <span>{data.event}</span>
          </p>
          <p>
            Package: <span>{data.package}</span>
          </p>
          <div>
            <p>Items:</p>
            {data.items.map((item, index) => (
              <p key={index}>
                Item: <span>{item.name}</span> - Count:{" "}
                <span>{item.count}</span>
              </p>
            ))}
          </div>

          <p>
            Tour Guide: <span>{data.tourGuide === "yes" ? "Yes" : "No"}</span>
          </p>
          <p>
            Total Amount: <span>{data.totalamount}</span>
          </p>
          <StripeCheckout
            amount={data.totalamount * 100} // Amount in cents
            token={onToken}
            currency="LKR"
            stripeKey={stripeKey}
          >
            <button>Continue To Checkout</button>
          </StripeCheckout>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetails;
