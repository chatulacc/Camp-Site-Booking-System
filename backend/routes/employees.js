const express = require('express');
const router = express.Router();
const Employees = require('../models/employees'); // Use your Employee model
const multer = require('multer');
const path = require('path');

// Configure Multer for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage: storage });

// Test route
router.get("/test", (req, res) => res.send("Employee routes working"));

// POST route to add a new employee with manually generated employeeID
router.post("/", upload.single('photo'), async (req, res) => {
    try {
        const employeeData = req.body;

        // Normalize gender field
        if (employeeData.gender) {
            employeeData.gender = employeeData.gender.charAt(0).toUpperCase() + employeeData.gender.slice(1).toLowerCase();
        }

        // Generate custom employeeId
        const employeeCount = await Employees.countDocuments(); // Get the count of employees
        const newEmployeeId = `EMP${(employeeCount + 1).toString().padStart(5, '0')}`; // e.g., EMP00001, EMP00002

        employeeData.employeeId = newEmployeeId; // Assign the generated employee ID

        if (req.file) {
            employeeData.photo = req.file.path; // Save the path of the uploaded photo
        }

        const newEmployee = new Employees(employeeData);
        await newEmployee.save(); // Save the employee to the database

        res.json({ msg: "Employee added successfully", employee: newEmployee });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(400).json({ msg: "Employee adding failed", error: error.message });
    }
});

// GET all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employees.find();
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ msg: "No employees found" });
    }
});

// GET employee by ID
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employees.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// PUT route to update an employee
router.put("/:id", async (req, res) => {
    try {
        const updatedEmployee = await Employees.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        res.json({ msg: "Updated successfully", employee: updatedEmployee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ msg: "Update failed" });
    }
});

// DELETE route to remove an employee
router.delete("/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employees.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        res.json({ msg: "Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ msg: "Cannot be deleted" });
    }
});

// API for employee count (for dashboard)
router.get("/count", async (req, res) => {
    try {
        const employeeCount = await Employees.countDocuments();
        res.json({ count: employeeCount });
    } catch (error) {
        console.error("Failed to count employees:", error);
        res.status(500).json({ msg: "Failed to count employees" });
    }
});
router.get('/api/employees/count', async (req, res) => {
    try {
      const employeeCount = await Employees.countDocuments();
      res.json({ count: employeeCount });
    } catch (error) {
      res.status(500).send(error);
    }
});

// API for gender distribution (for dashboard)
router.get("/gender-distribution", async (req, res) => {
    try {
        const genderCount = await Employees.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);
        res.json(genderCount);
    } catch (error) {
        console.error("Failed to get gender distribution:", error);
        res.status(500).json({ msg: "Failed to get gender distribution" });
    }
});

module.exports = router;