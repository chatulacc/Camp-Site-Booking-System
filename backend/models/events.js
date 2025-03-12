const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  imageurls: {
    type: [String],
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descript: {
    type: String,
    required: false,
  },
  rentperday: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  isIndoor: {
    type: Boolean,
    required: true,
  },
  isOutdoor: {
    type: Boolean,
    required: true,
  },
  detailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails' }
});

// Export the Event model
module.exports = mongoose.model("Event", eventSchema);
