const Client = require("../models/Client");
const Product = require("../models/product");
const logger = require("../Logger/logger");

const getLogMetadata = (req) => ({
  username: req.user ? req.user.id : "Unknown",
  ip: req.ip,
});

// Create Client Review
exports.createClient = async (req, res) => {
  try {
    const { productId, description, review } = req.body;

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const client = new Client({
      productId,        // Directly saving productId instead of nested 'products'
      description,
      review,
    });

    await client.save();

    logger.info(`Client Review Created: ${client._id}`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req),
    });

    res.status(201).json({
      success: true,
      message: "Client review created successfully",
      client,
    });
  } catch (error) {
    logger.error("Error creating client review", {
      error: error.message,
      stack: error.stack,
      ...getLogMetadata(req),
    });
    res.status(500).json({
      success: false,
      message: "Error creating client review",
      error: error.message,
    });
  }
};

// Get Client Reviews by Product
exports.getClient = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if productId is valid
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Fetch reviews using Product ID
    const reviews = await Client.find({ productId }).populate("productId");
    if (!reviews.length) {
      return res.status(404).json({ success: false, message: "No reviews found for this product" });
    }

    logger.info(`Fetched reviews for product: ${productId}`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req),
    });

    res.status(200).json({ success: true, message: "Product reviews fetched", reviews });
  } catch (err) {
    logger.error("Error fetching product reviews", {
      error: err.stack,
      ...getLogMetadata(req),
    });
    res.status(500).json({
      success: false,
      message: "Error fetching product reviews",
      error: err.message,
    });
  }
};

// Update Client Review
exports.updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { description, review } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client review not found" });
    }

    const updatedData = { description, review };
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const updatedClient = await Client.findByIdAndUpdate(clientId, updatedData, { new: true });

    res.status(200).json({
      success: true,
      message: "Client review updated successfully",
      client: updatedClient,
    });
  } catch (err) {
    logger.error("Error updating client review", {
      error: err.message,
      ...getLogMetadata(req),
    });
    res.status(500).json({
      success: false,
      message: "Error updating client review",
      error: err.message,
    });
  }
};

// Delete Client Review
exports.deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client review not found" });
    }

    await Client.findByIdAndDelete(clientId);

    res.status(200).json({ success: true, message: "Client review deleted successfully" });
  } catch (err) {
    logger.error("Error deleting client review", {
      error: err.message,
      ...getLogMetadata(req),
    });
    res.status(500).json({
      success: false,
      message: "Error deleting client review",
      error: err.message,
    });
  }
};
