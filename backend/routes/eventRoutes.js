const express = require('express');
const router = express.Router();
const Event = require('../models/events');

// Route to get all events
router.get('/getallevents', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Route to get a single event by ID
router.get('/getallevents/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Route to add a new event
router.post('/addevent', async (req, res) => {
    const { eventName, description, descript, rentperday, imageurls, dateAdded, isIndoor, isOutdoor } = req.body;

    try {
        const newEvent = new Event({
            eventName,
            description,
            descript,
            rentperday,
            imageurls, // Expecting an array of image URLs
            dateAdded,
            isIndoor,
            isOutdoor,
            currentbookings: [] // You can keep this if it's needed
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Route to update an existing event
router.put('/updateevent/:id', async (req, res) => {
    const { id } = req.params;
    const { eventName, description, descript, rentperday, imageurls, dateAdded, isIndoor, isOutdoor } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                eventName,
                description,
                descript,
                rentperday,
                imageurls,
                dateAdded,
                isIndoor,
                isOutdoor,
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Route to delete an event
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
