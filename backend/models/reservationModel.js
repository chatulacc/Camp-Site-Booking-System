const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  camplocation: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: true,
  },
  items: [
    {
      name: { 
        type: String, 
        required: true 
      },
      count: { 
        type: Number, 
        required: true, 
        min: 1 
      },
    },
  ], // Allowing multiple items
  tourGuide: {
    type: String,
    required: true,
  },
  userid: { 
    type: String, 
    required: true 
  }, 
  transactionId: { 
    type: String, 
    required: true 
  }, 
  totalamount: { 
    type: Number,
    required: true,
  },
  status: { 
    type: String, 
    required: true, 
    default: 'booked' 
  },
  isReservation: {
    type: Boolean,
    required: true,
    default: true // Always true for reservations
  }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
