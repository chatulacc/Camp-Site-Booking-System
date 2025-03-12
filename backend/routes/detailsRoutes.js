const express = require('express');
const router = express.Router();
const EventDetails = require('../models/EventDetails');

// Get all event details
router.get('/', async (req, res) => {
    try {
        const eventDetails = await EventDetails.find({});
        res.json(eventDetails);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get event details by ID
router.get('/:id', async (req, res) => {
    console.log(`Fetching event details for ID: ${req.params.id}`);
    try {
        const eventDetails = await EventDetails.findById(req.params.id);
        if (!eventDetails) {
            console.log('Event not found');
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(eventDetails);
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

// Create new event details
router.post('/', async (req, res) => {
    try {
        const newEventDetails = new EventDetails(req.body);
        const savedDetails = await newEventDetails.save();
        res.status(201).json({ id: savedDetails._id, ...savedDetails.toObject() });
    } catch (err) {
        console.error('Error saving event details:', err);
        res.status(500).json({ error: 'Failed to save event details' });
    }
});

// Update event details
router.put('/:id', async (req, res) => {
    try {
        const updatedDetails = await EventDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDetails) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(updatedDetails);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event details' });
    }
});

module.exports = router;
