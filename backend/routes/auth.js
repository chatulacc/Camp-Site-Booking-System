const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();
const isAdmin = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');


router.post('/register', async (req,res) => {
    const { username, email, password } = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg : 'User already exists'});
        }

        user = new User({username, email, password});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {user:{id:user.id}};

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
            if(err) throw err;
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.error('User not found with email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Incorrect password for email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, role: user.role }};
        console.log('Login successful for user:', user.email);

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'}, (err, token) => {
            if (err) {
                console.error('JWT signing error:', err.message);
                throw err;
            }
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).send('Server error');
    }
});



router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set token and expiration on user record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with reset link
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this email because you requested a password reset.\n\n
            Please click on the following link to reset your password:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Email sent with password reset instructions' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() } // Ensure token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/inquiry', auth, async(req, res) => {
    const { name, email, phone, message }= req.body;

    try{
        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            message,
            user: req.user.id, // Save user id here
        });

        await newInquiry.save();
        res.status(201).json({msg: 'Inquiry submitted successfully'});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the Authorization header
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the JWT secret from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select('-password'); // Exclude password
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username, email, phone } = req.body;

        // Find the user by their ID
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all inquiries (admin only)
router.get('/inquiries', isAdmin, async (req, res) => {
    try {
        const inquiries = await Inquiry.find(); // Fetch all inquiries from the database
        res.json(inquiries); // Return the inquiries as JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error'); // Handle server errors
    }
});

// Get inquiries for a specific user
router.get('/user-inquiries', auth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ user: req.user.id });
        res.json(inquiries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update inquiry
router.put('/inquiry/:id', auth, async (req, res) => {
    const { name, email, phone, message } = req.body;
    
    try {
        let inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ msg: 'Inquiry not found' });
        }

        // Ensure the user owns the inquiry
        if (inquiry.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { name, email, phone, message }, { new: true });

        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route for deleting an inquiry
router.delete('/inquiry/:id', auth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ msg: 'Inquiry not found' });
        }
        res.json({ msg: 'Inquiry deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/inquiries/search', auth, isAdmin, async (req, res) => {
    const { query } = req.query; // Get search query from request

    if (!query) {
        return res.status(400).json({ msg: 'No search query provided' });
    }

    try {
        const inquiries = await Inquiry.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },  // Case-insensitive search
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
                { message: { $regex: query, $options: 'i' } },
            ]
        });
        
        res.json(inquiries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});





module.exports = router;

