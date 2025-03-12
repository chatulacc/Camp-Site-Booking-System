const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconnection = require("./config/db");
const employeesRoutes = require("./routes/employees");
const leavesRoutes = require("./routes/leaves");
const path = require("path");
const fs = require("fs");
const Leave = require("./models/leaves"); // Use Leave model to query leave requests
const Employees = require("./models/employees"); // Use Employees model to query employees
const app = express();

// Enable CORS
app.use(cors({ origin: true, credentials: true }));

// DB connection
dbconnection();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log(`Uploads directory created at: ${uploadsDir}`);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Test route to ensure server is running
app.get("/", (req, res) => res.send("Hello, server is running"));

// Route to get the count of employees
app.get('/api/employees/count', async (req, res) => {
    try {
      const employeeCount = await Employees.countDocuments();
      res.json({ count: employeeCount });
    } catch (error) {
      res.status(500).send(error);
    }
});

// Routes for employees
app.use("/api/employees", employeesRoutes);

// Route for leave status
app.get('/api/leaves/status', async (req, res) => {
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

// Routes for leaves
app.use("/api/leaves", leavesRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
