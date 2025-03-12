const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
