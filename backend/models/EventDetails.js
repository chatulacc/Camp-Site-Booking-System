const mongoose = require('mongoose');

const EventDetailsSchema = new mongoose.Schema({
    imagesUrl: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    whatsIncluded: {
        type: [String],
        required: true
    },
    whatsNotIncluded: {
        type: [String],
        required: true
    },
    keyFeatures: {
        type: [String],
        required: true
    },
    termsAndConditions: {
        type: [String],
        required: true
    },
    thingsToKeepInMind: {
        type: String,
        required: true
    },
    otherInformation: {
        type: String,
        required: true
    }
});

const EventDetails = mongoose.model('EventDetails', EventDetailsSchema);
module.exports = EventDetails;
