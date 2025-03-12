const mongoose = require('mongoose');

// define schema for User
const UserSchema = new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// export the model
module.exports = mongoose.model('User', UserSchema);