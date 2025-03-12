const express = require("express");
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("your_stripe_secret_key");
const Booking = require("../models/booking");
const Camplocation = require("../models/camplocation");
const Delivery = require("../models/delivery"); // Corrected import

router.post("/bookcamplocation", async (req, res) => {
  const { camplocation, fromdate, todate, totalamount, totaldays, token, deliveryInfo } = req.body; // Added deliveryInfo

  if (!camplocation || !fromdate || !todate || !totalamount || !totaldays || !deliveryInfo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "lkr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = new Booking({
        camplocation: camplocation.name,
        camplocationid: camplocation._id,
        userid: "1111",
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionId: "1234",
      });

      const booking = await newBooking.save();

      // Save delivery information
      const newDelivery = new Delivery({
        name: deliveryInfo.name,
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        bookingId: booking._id, // Link delivery to the booking
      });

      await newDelivery.save();

      const camplocationtemp = await Camplocation.findOne({ _id: camplocation._id });
      camplocationtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: "1111",
        status: booking.status,
      });

      await camplocationtemp.save();
    }

    res.send("Payment Successful, Your Camplocation is booked");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Other routes...

module.exports = router;
