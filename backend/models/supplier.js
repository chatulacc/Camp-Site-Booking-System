const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    uniqueSupplierID: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    typeOfGoods: {
      type: String,
      required: true,
    },

    imageurls: [],

    supplyCapacity: {
      type: String,
      required: false,
    },
    pricingInformation: {
      type: String,
      required: false,
    },

    bankAccountDetails: {
      type: String,
      required: false,
    },
    paymentTerms: {
      type: String,
      required: false,
    },

    pastPerformance: {
      type: String,
      enum: ["Active", "Inactive"],
      required: false,
    },

    incidentReports: {
      type: String,
      required: false,
    },

    attachments: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required: false,
    },

    communicationHistory: {
      type: [String],
      required: false,
    },
    image: {
      type: String,
      required: false, // Set to true if image is mandatory
    },

    // Add a field to reference the supplier orders
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supplierOrder', // This refers to the supplierOrder model
    }]
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("supplier", SupplierSchema);
