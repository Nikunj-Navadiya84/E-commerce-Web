const Order = require("../models/order");
const logger = require("../Logger/logger");

const getLogMetadata = (req, user = null) => ({
    username: user ? user._id : "Unknown",
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
});

// Place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod, payment } = req.body;
        const user = req.user && req.user._id;

        if (!user || !Array.isArray(items) || items.length === 0 || !amount || typeof address !== 'object' || !paymentMethod) {
            logger.warn("Invalid order placement attempt", { ...getLogMetadata(req, req.user), body: req.body });
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

        logger.info("Order placed successfully", { ...getLogMetadata(req, req.user), orderId: savedOrder._id });

        return res.status(201).json({
            message: "Order placed successfully.",
            order: savedOrder,
        });

    } catch (error) {
        logger.error("Error placing order", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        return res.status(500).json({ message: "Server error. Could not place order." });
    }
};

// Get orders for a specific user
exports.userOrder = async (req, res) => {
    try {
        const user = req.user && req.user._id;

        if (!user) {
            logger.warn("Unauthorized attempt to fetch user orders", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
        }

        const orders = await Order.find({ user });

        logger.info("User orders fetched successfully", { ...getLogMetadata(req, req.user), orderCount: orders.length });

        return res.status(200).json({ success: true, orders });

    } catch (error) {
        logger.error("Error fetching user orders", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        return res.status(500).json({ success: false, message: "Server error. Could not fetch orders." });
    }
};

// Get all orders for Admin panel
exports.allOrder = async (req, res) => {
    try {
        const orders = await Order.find({});
        logger.info("All orders fetched for admin", { ...getLogMetadata(req, req.user), orderCount: orders.length });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        logger.error("Error fetching all orders", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        return res.status(500).json({ success: false, message: "Server error. Could not fetch orders." });
    }
};

// Update order status from Admin panel
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            logger.warn("Invalid update status request", { ...getLogMetadata(req, req.user), body: req.body });
            return res.status(400).json({ success: false, message: "Invalid request: Missing orderId or status." });
        }

        await Order.findByIdAndUpdate(orderId, { status });

        logger.info("Order status updated", { ...getLogMetadata(req, req.user), orderId, newStatus: status });

        res.json({ success: true, message: 'Order status updated successfully' });

    } catch (error) {
        logger.error("Error updating order status", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        res.status(500).json({ success: false, message: "Server error. Could not update order status." });
    }
};

exports.totalpaid = async (req, res) => {
    try {
        const paidOrders = await Order.find({ payment: true });
        res.status(200).json({
          success: true,
          totalPaidOrders: paidOrders.length,
          data: paidOrders
        });
      } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch paid orders", error: err.message });
      }
}