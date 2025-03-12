const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    
    employeeId: {
        type: String,
        required: true, // Ensure it's a required field
        unique: true   // Employee ID should be unique
      },
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        match: /.+\@.+\..+/ // Basic email validation
    },
    phoneNumber: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"], // Use enum for gender options
    },
    address: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    salary: {
        type: Number, // Ensure salary field is added
        required: false // Set to false if it's not mandatory during employee creation
    }
});

module.exports = mongoose.model("employees", EmployeeSchema);
