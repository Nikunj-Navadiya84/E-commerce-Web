const Wishlist = require("../models/Wishlist");
const logger = require("../Logger/logger");

const getLogMetadata = (req, user = null) => ({
  username: user ? user._id : "Unknown",
  method: req.method,
  path: req.originalUrl,
  ip: req.ip,
});

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to add to wishlist", getLogMetadata(req));
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.body;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      logger.info("Product added to wishlist", { ...getLogMetadata(req, req.user), productId });
      return res.status(200).json({ success: true, message: "Product added to wishlist" });
    }

    logger.info("Attempted to add duplicate product to wishlist", { ...getLogMetadata(req, req.user), productId });
    res.status(400).json({ success: false, message: "Product already in wishlist" });

  } catch (error) {
    logger.error("Error adding to wishlist", {
      ...getLogMetadata(req, req.user),
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to get wishlist", getLogMetadata(req));
      return res.status(401).json({ success: false, message: "Unauthorized - User not found" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      logger.info("Empty wishlist accessed", getLogMetadata(req, req.user));
      return res.status(404).json({ success: false, message: "Wishlist is empty" });
    }

    logger.info("Wishlist fetched successfully", getLogMetadata(req, req.user));
    res.status(200).json({ success: true, wishlist });

  } catch (error) {
    logger.error("Error fetching wishlist", {
      ...getLogMetadata(req, req.user),
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to remove from wishlist", getLogMetadata(req));
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      logger.info("Wishlist not found for removal", getLogMetadata(req, req.user));
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    logger.info("Product removed from wishlist", { ...getLogMetadata(req, req.user), productId });
    res.status(200).json({ success: true, message: "Product removed from wishlist" });

  } catch (error) {
    logger.error("Error removing from wishlist", {
      ...getLogMetadata(req, req.user),
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
