const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Email should remain unique
    },
    DOB: {
        type: Date,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    specialties: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    username: {
        type: String, // Optional username without uniqueness constraint
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('TourGuide', tourGuideSchema);
