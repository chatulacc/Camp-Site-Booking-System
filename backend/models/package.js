const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageType: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    
    description: { type: String, required: true },
    addedCount: { type: Number }   ,
    image: { type: String },  // To store the image path
    addedNames: { type: [String], default: [] }, // For storing enrolled user names
      // For keeping track of the number of enrollments
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
