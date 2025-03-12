const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'InventoryItem', // Reference to an Inventory model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            supplier: {
                type: String,
                required: true,
            },
            notes: {
                type: String,
                default: ''
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending',  // New orders will default to 'pending'
        enum: ['pending', 'completed', 'cancelled','placed']  // Add other statuses if needed
    }
});

module.exports = mongoose.model('order', orderSchema);