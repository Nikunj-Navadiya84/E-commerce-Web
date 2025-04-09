const Order = require("../models/order");

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod, payment } = req.body;
    const user = req.user && req.user._id;

    // Basic validation
    if (!user || !Array.isArray(items) || items.length === 0 || !amount || typeof address !== 'object' || !paymentMethod) {
      return res.status(400).json({ message: "Missing or invalid required fields." });
    }

    const newOrder = new Order({
      user,
      items,
      amount,
      address,
      paymentMethod,
      payment: payment || false,
      date: Date.now(),
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    return res.status(500).json({ message: "Server error. Could not place order." });
  }
};

module.exports = { placeOrder };
