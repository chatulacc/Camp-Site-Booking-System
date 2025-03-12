const express = require('express');
const router = express.Router();
const Leave = require('../models/leaves'); // Ensure the correct path to your Leave model
const leaves = require('../models/leaves');

// POST route to submit a new leave request
router.post('/', async (req, res) => {
    const { employeeId, userName, reason } = req.body;

    try {
        const newLeave = new Leave({
            employeeId,
            userName,
            reason,
            status: 'Pending' // Default status when a leave is submitted
        });
        await newLeave.save();
        res.status(201).json({ msg: 'Leave request submitted successfully', newLeave });
    } catch (error) {
        console.error('Error submitting leave request:', error);
        res.status(500).json({ msg: 'Error submitting leave request' });
    }
});

// GET route to fetch the leave request by employeeId
router.get('/:employeeId', async (req, res) => {
    try {
        const leaveRequest = await Leave.findOne({ employeeId: req.params.employeeId });
        if (!leaveRequest) {
            return res.status(404).json({ msg: 'Leave request not found' });
        }
        res.json(leaveRequest);
    } catch (error) {
        console.error('Error fetching leave request:', error);
        res.status(500).json({ msg: 'Error fetching leave request' });
    }
});

// PUT route to update the leave request status (Accept/Decline)
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    if (!['Accepted', 'Declined'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        const updatedLeave = await leaves.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updatedLeave) {
            return res.status(404).json({ msg: 'Leave request not found' });
        }
        res.json({ msg: 'Leave request updated successfully', updatedLeave });
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(500).json({ msg: 'Error updating leave request' });
    }
});
router.get('/api/leaves/status', async (req, res) => {
    try {
        // Count the number of leave requests with different statuses
        const pendingCount = await Leave.countDocuments({ status: 'Pending' });
        const acceptedCount = await Leave.countDocuments({ status: 'Accepted' });
        const declinedCount = await Leave.countDocuments({ status: 'Declined' });

        // Check if there are no leave requests
        if (pendingCount === 0 && acceptedCount === 0 && declinedCount === 0) {
            return res.status(404).json({ msg: 'Leave request not found' });
        }

        // If leave requests exist, send back the counts
        res.json({ pending: pendingCount, accepted: acceptedCount, declined: declinedCount });
    } catch (error) {
        console.error('Error fetching leave status:', error);
        res.status(500).json({ msg: 'Error fetching leave status' });
    }
});
module.exports = router;