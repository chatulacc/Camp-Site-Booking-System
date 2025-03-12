const express = require('express');
const router = express.Router();
const multer = require('multer');
const Package = require('../models/package');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\/g, '/')}`);
  }
});

const upload = multer({ storage: storage });

// Create a new package
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { packageType, name, price, description, addedCount } = req.body;

    const newPackage = new Package({
      packageType,
      name,
      price,
      description,
      addedCount: addedCount || 0,
      image: req.file ? req.file.filename.replace(/\\/g, '/') : null, // Replace backslashes with forward slashes
      addedNames: []
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Error creating package' });
  }
});

// GET all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
});

// Update a package by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Extract the ID from the URL
    const updatedData = req.body; // Get the updated data from the request body

    // Update the package and return the updated document (new: true)
    const updatedPackage = await Package.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
});

// Delete a package by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(204).send(); // No content to send back after deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
});


module.exports = router;
