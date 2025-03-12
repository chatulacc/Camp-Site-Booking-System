const express = require('express');
const router = express.Router();
const UserModel = require('../models/Usermodel'); // Adjust the path to the actual model

// POST route to create a new tour guide
router.post('/', async (req, res) => {
    try {
        const newGuide = new UserModel(req.body);
        await newGuide.save();
        res.status(201).json(newGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET route to retrieve all tour guides
router.get('/', async (req, res) => {
    console.log("GET request received for all guides");
    try {
        const guides = await UserModel.find();
        console.log("Fetched guides:", guides); // Log fetched guides
        res.status(200).json(guides);
    } catch (error) {
        console.error("Error fetching guides:", error); // Log errors
        res.status(500).json({ message: error.message });
    }
});

// GET route to retrieve a specific tour guide by ID
router.get('/:id', async (req, res) => {
    try {
        const guide = await UserModel.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Tour Guide not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT route to update a tour guide by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedGuide = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedGuide) {
            return res.status(404).json({ message: 'Tour Guide not found' });
        }
        res.status(200).json(updatedGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE route to delete a tour guide by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedGuide = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedGuide) {
            return res.status(404).json({ message: 'Tour Guide not found' });
        }
        res.status(200).json({ message: 'Tour Guide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
