const mongoose = require('mongoose');
const User = require('./models/User');  // Adjust the path to your User model

// Connect to MongoDB (adjust the connection string to match your setup)
mongoose.connect('mongodb+srv://Chathula:chatula2002@inventory.mbjab.mongodb.net/?retryWrites=true&w=majority&appName=Inventory')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Once connected, perform the update
const updateUsers = async () => {
  try {
    const result = await User.updateMany({}, { 
      $set: { 
        resetPasswordToken: null, 
        resetPasswordExpire: null 
      } 
    });
    console.log(`Updated ${result.nModified} users`);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    mongoose.connection.close();  // Close the connection when done
  }
};

// Run the update function
updateUsers();
