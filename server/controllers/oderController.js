const order = require("../models/order");
const Order = require("../models/order");

exports.placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod, payment } = req.body;
    const user = req.user && req.user._id;
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


// Get orders for a specific user
exports.userOrder = async (req, res) => {
  try {
    const user = req.user && req.user._id;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
    }

    const orders = await Order.find({ user });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Could not fetch orders." });
  }
};
