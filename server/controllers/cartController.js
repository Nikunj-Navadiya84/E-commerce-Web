const Cart = require("../models/cart");
const logger = require("../Logger/logger");

const getLogMetadata = (req, user = null) => ({
    username: user ? user._id : "Unknown",
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
});

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn("Unauthorized attempt to add to cart", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [{ product: productId, quantity }],
            });
        } else {
            const existingProduct = cart.products.find(p => p.product.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }

        await cart.save();
        logger.info("Product added to cart", { ...getLogMetadata(req, req.user), productId, quantity });
        return res.status(200).json({ success: true, message: "Cart updated", cart });

    } catch (error) {
        logger.error("Error updating cart", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn("Unauthorized access attempt", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            logger.info("Cart is empty", { ...getLogMetadata(req, req.user) });
            return res.status(404).json({ success: false, message: "Cart is empty" });
        }

        logger.info("Cart retrieved successfully", { ...getLogMetadata(req, req.user) });
        return res.status(200).json({ success: true, cart });

    } catch (error) {
        logger.error("Error fetching cart", {
            error: error.message,
            stack: error.stack,
            ...getLogMetadata(req, req.user)
        });
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// update
exports.updateQuantityInCart = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn("Unauthorized attempt to update quantity", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const parsedQuantity = Number(quantity);

        if (!productId || isNaN(parsedQuantity) || parsedQuantity < 0) {
            logger.warn("Invalid input for quantity update", { ...getLogMetadata(req, req.user), productId, quantity });
            return res.status(400).json({
                success: false,
                message: "Invalid productId or quantity",
            });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            logger.warn("Cart not found for quantity update", getLogMetadata(req, req.user));
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex === -1) {
            logger.warn("Product not in cart during quantity update", { ...getLogMetadata(req, req.user), productId });
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        if (parsedQuantity === 0) {
            cart.products.splice(productIndex, 1);
            logger.info("Product removed from cart due to zero quantity", { ...getLogMetadata(req, req.user), productId });
        } else {
            cart.products[productIndex].quantity = parsedQuantity;
            logger.info("Product quantity updated", { ...getLogMetadata(req, req.user), productId, newQuantity: parsedQuantity });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        logger.error("Error updating cart quantity", {
            error: error.message,
            stack: error.stack,
            ...getLogMetadata(req, req.user)
        });
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Remove Product from Cart
exports.removeFromCart = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn("Unauthorized attempt to remove product from cart", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId } = req.body;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            logger.warn("Cart not found during product removal", getLogMetadata(req, req.user));
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex === -1) {
            logger.warn("Product not found in cart during removal", { ...getLogMetadata(req, req.user), productId });
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        cart.products.splice(productIndex, 1); // ❌ Directly remove product, skip quantity check
        logger.info("Product fully removed from cart", { ...getLogMetadata(req, req.user), productId });

        await cart.save();

        res.status(200).json({ success: true, message: "Product removed from cart", cart });
    } catch (error) {
        logger.error("Error removing from cart", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        if (!req.user) {
            logger.warn("Unauthorized attempt to clear cart", getLogMetadata(req));
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            logger.warn("Cart not found during clear operation", getLogMetadata(req, req.user));
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.products = [];
        await cart.save();

        logger.info("Cart cleared", { ...getLogMetadata(req, req.user) });
        res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
    } catch (error) {
        logger.error("Error clearing cart", { error: error.message, stack: error.stack, ...getLogMetadata(req, req.user) });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
