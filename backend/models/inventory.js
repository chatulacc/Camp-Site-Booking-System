const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },  
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, 
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  supplier: {
    type: String,
    required: false,
  },
  reorderLevel: {
    type: Number,
    required: false,
    min: 0,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);
