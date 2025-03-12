const express = require("express");
const router = express.Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51PupSZ2L6Flr4EhiPY5ivOFUTbOwn6TLXlPSFTe3cdyonxA2cwWRP9CYzynRCAZWpybNSA3XmNqcjoOjiTh6kM4Y00yJQ0fn90"
);
const Booking = require("../models/booking");
const Camplocation = require("../models/camplocation");

router.post("/bookcamplocation", async (req, res) => {
  //   userid
  const { camplocation, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  if (!camplocation || !fromdate || !todate || !totalamount || !totaldays) {
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
      
        const newbooking = new Booking({
          camplocation: camplocation.name,
          camplocationid: camplocation._id,
          userid: "1111",
          fromdate: moment(fromdate).format("DD-MM-YYYY"),
          todate: moment(todate).format("DD-MM-YYYY"),
          totalamount,
          totaldays,
          transactionId: "1234",
        });

        const booking = await newbooking.save();

        const camplocationtemp = await Camplocation.findOne({
          _id: camplocation._id,
        });

        camplocationtemp.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(fromdate).format("DD-MM-YYYY"),
          todate: moment(todate).format("DD-MM-YYYY"),
          userid: "1111",
          status: booking.status,
        });

        await camplocationtemp.save();
    }

    res.send("Payment Successfull, Your Camplocation is booked");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid

  try {
    const bookings = await Booking.find({userid : userid})
    res.send(bookings)  
  } catch (error) {
    return res.status(400).json({ error })
  }

});

// GET all bookings
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ bookings });
    // res.send(bookings)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/cancelbooking" , async(req, res) => {
  const {bookingid , camplocationid} = req.body

  try {
    const bookingitem = await Booking.findOne({_id : bookingid})

    bookingitem.status = 'cancelled'
    await bookingitem.save()

    const camplocation = await Camplocation.findOne({_id : camplocationid})

    const bookings = camplocation.currentbookings

    const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
    camplocation.currentbookings = temp

    await camplocation.save()

    res.send('Your booking cancelled successfully')
  } catch (error) {
    return res.status(400).json({error});
  }
})

router.post("/updatebooking", async (req, res) => {
  const { bookingId, camplocation, fromdate, todate, totalamount, totaldays } = req.body;

  if (!bookingId || !camplocation || !fromdate || !todate || !totalamount || !totaldays) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking details
    booking.camplocation = camplocation.name;
    booking.camplocationid = camplocation._id;
    booking.fromdate = moment(fromdate).format("DD-MM-YYYY");
    booking.todate = moment(todate).format("DD-MM-YYYY");
    booking.totalamount = totalamount;
    booking.totaldays = totaldays;

    // Save the updated booking
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;