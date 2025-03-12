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
    }
});

module.exports = mongoose.model('Order', orderSchema);
