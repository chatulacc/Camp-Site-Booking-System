const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservationModel");
const Stripe = require("stripe"); // Import Stripe
const stripe = new Stripe("sk_test_51PupSZ2L6Flr4EhiPY5ivOFUTbOwn6TLXlPSFTe3cdyonxA2cwWRP9CYzynRCAZWpybNSA3XmNqcjoOjiTh6kM4Y00yJQ0fn90");

// Utility function to calculate total amount based on request data
const calculateTotalAmount = (data) => {
  const rentPerDay = getRentPerDay(data);
  const numberOfDays = calculateNumberOfDays(data.fromDate, data.toDate);
  return rentPerDay * numberOfDays;
};

const getRentPerDay = (data) => {
  const rentRates = {
    event: { stargazing: 1000, campfire: 1500, bbq: 2000 },
    package: { family: 3000, friends: 4000, couple: 2500 },
    items: { tent: 500, bag: 200, bbq_machine: 700 },
    camplocation: {
      forest_camp: 1200,
      desert_camp: 1000,
      mountain_camp: 1500,
    },
  };

  const eventRent = rentRates.event[data.event] || 0;
  const packageRent = rentRates.package[data.package] || 0;
  const itemRent = data.items.reduce(
    (total, item) => total + (rentRates.items[item.name] || 0) * item.count,
    0
  );
  const campLocationRent = rentRates.camplocation[data.camplocation] || 0;

  return eventRent + packageRent + itemRent + campLocationRent;
};

const calculateNumberOfDays = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
};


// Create a new reservation
router.post("/", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const totalamount = calculateTotalAmount(req.body);
    const reservation = new Reservation({
      camplocation: req.body.camplocation,
      fromDate: new Date(req.body.fromDate), // Ensure it’s a Date object
      toDate: new Date(req.body.toDate), // Ensure it’s a Date object
      event: req.body.event,
      package: req.body.package,
      items: req.body.items,
      numberOfItems: req.body.numberOfItems || 1, // Default to 1 if not provided
      tourGuide: req.body.tourGuide,
      userid: "1111", // Add userid
      transactionId: "1234",
      totalamount,
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error saving reservation:", error); // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
});

// Route for processing payments
router.post("/payments/charge", async (req, res) => {
    const { totalamount, token } = req.body; // Destructure the necessary fields from the request body

    try {
        // Create a charge with Stripe
        const charge = await stripe.charges.create({
            amount: totalamount * 100, // Amount in cents
            currency: "LKR", // Replace with the desired currency
            source: token.id, // The token ID received from Stripe
            description: `Payment for booking at ${req.body.camplocation}`, // Optional description
        });

        // Send a success response if payment is successful
        res.status(200).json({ message: "Payment successful!", charge });
    } catch (error) {
        console.error("Payment error:", error); // Log the error for debugging
        res.status(500).json({ error: "Payment failed", details: error.message });
    }
});

//fetch reservations by userid
router.get("/", async (req, res) => {
  const { userid } = req.query;
  try {
    const reservations = await Reservation.find({ userid });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//route for canceling reservations
router.post("/cancelbooking", async (req, res) => {
  const { bookingid } = req.body;

  try {
      // Find the reservation by booking ID
      const reservation = await Reservation.findById(bookingid);

      if (!reservation) {
          return res.status(404).json({ error: "Reservation not found" });
      }

      // Update the status of the reservation to cancelled
      reservation.status = "cancelled";
      await reservation.save();

      res.status(200).json({ message: "Booking cancelled successfully", reservation });
  } catch (error) {
      console.error("Error canceling reservation:", error);
      res.status(500).json({ error: error.message });
  }
});

// Route for updating a reservation
router.put("/update/:bookingId", async (req, res) => {
  const { bookingId } = req.params; // Get bookingId from the URL parameters
  const updatedData = req.body; // Get updated data from the request body

  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(bookingId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Update the reservation details
    reservation.camplocation = updatedData.camplocation;
    reservation.fromDate = new Date(updatedData.fromDate);
    reservation.toDate = new Date(updatedData.toDate);
    reservation.event = updatedData.event;
    reservation.package = updatedData.package;
    reservation.items = updatedData.items;
    reservation.tourGuide = updatedData.tourGuide;
    reservation.totalamount = calculateTotalAmount(updatedData); // Recalculate total amount

    // Save the updated reservation
    await reservation.save();

    res.status(200).json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all reservations
router.get("/getallreservations", async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
