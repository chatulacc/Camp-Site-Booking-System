const express = require("express");
const router = express.Router();
const Order = require("../models/orders"); // Import the Order model

// Create a new order (POST)
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }

    const newOrder = new Order({
      items: items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        supplier: item.supplier,
        notes: item.notes,
      })),
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch all orders (GET)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch a specific order by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update an existing order by ID (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          supplier: item.supplier,
          notes: item.notes,
        })),
      },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an order by ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
