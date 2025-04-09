const Cart = require("../models/cart");
const logger = require("../Logger/logger");

// Add TO Cart
exports.addToCart = async (req, res) => {
    try {
        if (!req.user) {
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
        return res.status(200).json({ success: true, message: "Cart updated", cart });

    } catch (error) {
        logger.error("Error updating cart", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is empty" });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        logger.error("Error fetching cart", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update Quantity in Cart
exports.updateQuantityInCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const parsedQuantity = Number(quantity);

        if (!productId || isNaN(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid productId or quantity",
            });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        if (parsedQuantity === 0) {
            cart.products.splice(productIndex, 1); // remove item
        } else {
            cart.products[productIndex].quantity = parsedQuantity;
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
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { productId } = req.body;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        const productInCart = cart.products[productIndex];

        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
        } else {
            cart.products.splice(productIndex, 1);
        }

        await cart.save();

        res.status(200).json({ success: true, message: "Cart updated successfully", cart });
    } catch (error) {
        logger.error("Error removing from cart", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
    } catch (error) {
        logger.error("Error clearing cart", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
