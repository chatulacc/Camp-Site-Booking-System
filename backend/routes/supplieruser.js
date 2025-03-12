const mongoose = require('mongoose');

const SupplierUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['SupplierManager', 'Supplier'], // Define roles
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('supplieruser', SupplierUserSchema);
