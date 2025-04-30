const Product = require("../models/product");
const logger = require("../Logger/logger");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const getLogMetadata = (req) => ({
  username: req.user ? req.user.id : "Unknown",
  ip: req.ip,
});


// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, categories, description, weight, price, quantity = 0, discountPercentage = 0 } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        images.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(file.path); // Delete temp file
      }
    }

    const status = quantity > 0 ? "Available" : "Out of Stock";
    const offerPrice = discountPercentage > 0 ? price - (price * discountPercentage) / 100 : price;

    const product = new Product({ name, categories, description, weight, price, offerPrice, discountPercentage, images, quantity, status });

    await product.save();

    logger.info(`Product Created: ${product._id}`, { method: req.method, path: req.originalUrl, ...getLogMetadata(req) });

    res.status(201).json({ success: true, message: "Product created successfully", product });

  } catch (error) {
    logger.error("Error creating product", { error: error.message, stack: error.stack, ...getLogMetadata(req) });
    res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products.length) return res.status(404).json({ success: false, message: "No products found" });

    logger.info(`Fetched ${products.length} products`, { method: req.method, path: req.originalUrl, ...getLogMetadata(req) });

    res.status(200).json({ success: true, message: "Products fetched", products });
  } catch (err) {
    logger.error("Error fetching products", { error: err.message, ...getLogMetadata(req) });
    res.status(500).json({ success: false, message: "Error fetching products", error: err.message });
  }
};


// update Product
exports.updateProduct = async (req, res) => {
  try {
    const editid = req.params.id;

    const {
      name, categories, description, weight,
      price, quantity, discountPercentage,
      removedImages = []
    } = req.body;

    const removedImagesArray = Array.isArray(removedImages) ? removedImages : [];

    const extractPublicId = (url) => {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      return `products/${fileName.split(".")[0]}`;
    };

    const normalizedRemovedImages = removedImagesArray.map(item =>
      item.includes("cloudinary.com") ? extractPublicId(item) : item
    );

    const oldProduct = await Product.findById(editid);
    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const validRemovedImages = oldProduct.images
      .filter((img) => normalizedRemovedImages.includes(img.public_id))
      .map((img) => img.public_id);

    await Promise.all(
      validRemovedImages.map(async (public_id) => {
        try {
          await cloudinary.uploader.destroy(public_id);
          logger.info("Deleted image from Cloudinary", { public_id });
        } catch (cloudErr) {
          logger.warn("Failed to delete image from Cloudinary", { public_id, error: cloudErr.message });
        }
      })
    );

    let existingImages = oldProduct.images.filter(
      (img) => !normalizedRemovedImages.includes(img.public_id)
    );

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products"
          });

          existingImages.push({
            url: result.secure_url,
            public_id: result.public_id
          });
        } catch (uploadErr) {
          logger.error("Image upload failed", { error: uploadErr.message });
        } finally {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {
            logger.warn("Failed to delete local file", { error: err.message });
          }
        }
      }
    }

    const status = quantity > 0 ? "Available" : "Out of Stock";
    const offerPrice = discountPercentage > 0
      ? price - (price * discountPercentage) / 100
      : price;

    const updatedData = {
      name, categories, description, weight,
      price, quantity, discountPercentage,
      status, offerPrice,
      images: existingImages
    };

    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(editid, updatedData, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (err) {
    logger.error("Error updating product", { error: err.message, ...getLogMetadata(req) });
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (err) {
    logger.error("Error deleting product", { error: err.message, ...getLogMetadata(req) });
    res.status(500).json({ success: false, message: "Error deleting product", error: err.message });
  }
};
