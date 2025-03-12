const express = require('express');
const multer = require('multer'); // Import multer for file handling
const router = express.Router();
const Item = require('../models/inventory');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_your_secret_key'); // Replace with your actual Stripe secret key

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify directory for saving images
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); // Create unique filenames
  }
});

const upload = multer({ storage: storage });

// POST route to add a new item with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newItem = new Item({
      image: req.file ? req.file.path : '',  // Store image path or leave empty
      itemName: req.body.itemName,
      sku: req.body.sku,
      category: req.body.category,
      quantity: req.body.quantity,
      price: req.body.price,
      supplier: req.body.supplier,
      reorderLevel: req.body.reorderLevel,
      dateAdded: req.body.dateAdded || Date.now(),  // Use current date if none provided
    });

    await newItem.save(); // Save the item to the database
    res.status(201).json(newItem); // Return the newly created item
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error: error.message });
  }
});

// PUT route to decrease the quantity of an item by ID
router.put('/decrease-quantity/:id', async (req, res) => {
  try {
    const { quantity } = req.body; // Get the quantity to decrease
    const item = await Item.findById(req.params.id); // Find item by ID
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure there is enough quantity in stock
    if (item.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Decrease item quantity
    item.quantity -= quantity;
    await item.save(); // Save changes

    res.status(200).json(item); // Return updated item
  } catch (error) {
    res.status(500).json({ message: 'Error decreasing item quantity', error: error.message });
  }
});

// POST route to handle payment
// Handle Stripe payment
router.post("/processpayment", async (req, res) => {
  const { cart, totalamount, token } = req.body;

  // Validate the input
  if (!cart || !totalamount || !token) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Create a charge
    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100, // Convert to cents
        currency: "usd", // Change to your preferred currency
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(), // Ensure the charge is idempotent
      }
    );

    // If the payment is successful, you can process the booking or order here
    if (payment) {
      // Iterate over the cart and handle the business logic for each item
      for (const item of cart) {
        // Your logic for handling each item in the cart, like updating inventory or creating orders
        console.log(`Processing item: ${item.name}, Quantity: ${item.quantity}`);
        // For example, you can decrease inventory or save orders to the database
      }

      // Respond with a success message
      res.status(200).json({ success: true, message: "Payment successful", payment });
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ success: false, message: "Payment failed", error: error.message });
  }
});



// GET route to fetch all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.status(200).json(items); // Return the list of items
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// GET route to fetch a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Find item by ID
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item); // Return the item
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// PUT route to update an item by ID (with optional image update)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      itemName: req.body.itemName,
      sku: req.body.sku,
      category: req.body.category,
      quantity: req.body.quantity,
      price: req.body.price,
      supplier: req.body.supplier,
      reorderLevel: req.body.reorderLevel,
      dateAdded: req.body.dateAdded,
    };

    if (req.file) {
      updateData.image = req.file.path; // If a new image is uploaded, update the image path
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item); // Return updated item
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// DELETE route to remove an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id); // Find and delete item by ID
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router;
