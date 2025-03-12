const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    imageurls: [],
    rentperday : {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    maxcount : {
        type: Number,
        required: true
    },
    currentbookings : [],
    description : {
        type: String,
        required: true
    }
}, {
    timestamps : true,
})

const locationModel = mongoose.model('camplocations' , locationSchema)
module.exports = locationModel;