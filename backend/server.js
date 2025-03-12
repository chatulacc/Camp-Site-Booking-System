const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');

// Initialize environment variables
dotenv.config();

// Initialize Express app and Stripe instance
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Load Stripe secret key from .env

// Connect to MongoDB (remove quotes around `process.env.MONGO_URI`)
mongoose.connect(process.env.MONGO_URI, {  // Corrected line
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // adjust this to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

// Importing Routes
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/order');
const camplocationsRoutes = require('./routes/camplocationsRoute');
const bookingsRoutes = require('./routes/bookingsRoute');
const reservationRoutes = require('./routes/reservationRoutes');
const supplierRoutes = require("./routes/supplier");
const supplierOrderRoutes = require("./routes/supplierOrder");
const eventRoutes = require('./routes/eventRoutes');
const eventDetailsRoutes = require('./routes/detailsRoutes');
const employeesRoutes = require("./routes/employees");
const leavesRoutes = require("./routes/leaves");
const authRoutes = require('./routes/auth');  // Authentication routes
const path = require('path');
const packageRoutes = require('./routes/package');
const GuideRoutes = require('./routes/TourGuid');

// Use Routes
app.use('/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/camplocations', camplocationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/supplierOrder', supplierOrderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-details', eventDetailsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/auth', authRoutes); // Authentication routes
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads').replace(/\\/g, '/')));
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});
app.use('/package', packageRoutes);
app.use('/TourGuid', GuideRoutes);

// Static test route
app.get("/", (req, res) => res.send("Hello, the server is running!"));

// Test route for debugging
app.get('/test', (req, res) => {
  res.send('Test route working!');
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
