const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    camplocation : {
        type: String,
        required: true
    },
    camplocationid : {
        type: String, 
        required: true
    },
    userid : {
        type: String,
        required: true
    },
    fromdate : {
        type: String,
        required: true
    },
    todate : {
        type: String,
        required: true
    },
    totalamount : {
        type : Number,
        required: true
    },
    totaldays : {
        type : Number,
        required: true
    },
    transactionId : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : 'booked'
    },
    isReservation: {
        type: Boolean,
        required: true,
        default: false // Regular booking by default
    }
}, {
    timestamps : true,
})

const bookingmodel = mongoose.model('bookings' , bookingSchema);

module.exports = bookingmodel