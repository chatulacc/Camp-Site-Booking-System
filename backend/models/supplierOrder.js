const mongoose = require('mongoose');

const SupplierOrderSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ["pending", "placed", "completed"],
    default: "placed",
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('supplierOrder', SupplierOrderSchema);
