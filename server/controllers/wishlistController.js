const Wishlist = require("../models/Wishlist");
const logger = require("../Logger/logger");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    if (!req.user) {
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
      return res.status(200).json({ success: true, message: "Product added to wishlist" });
    }

    res.status(400).json({ success: false, message: "Product already in wishlist" });

  } catch (error) {
    logger.error("Error adding to wishlist", { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// wish List
exports.getWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized - User not found" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist is empty" });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productId } = req.body;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Product removed from wishlist" });

  } catch (error) {
    logger.error("Error removing from wishlist", { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
