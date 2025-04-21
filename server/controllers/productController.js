const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const logger = require("../Logger/logger");

const getLogMetadata = (req) => ({
  username: req.user ? req.user.id : "Unknown",
  ip: req.ip,
});


// Add Product
exports.createProduct = async (req, res) => {
  try {
    const { name, categories, description, weight, price, quantity = 0, discountPercentage = 0 } = req.body;
    const images = req.files?.map(file => file.path) || [];
    const status = quantity > 0 ? "Available" : "Out of Stock";
    const offerPrice = discountPercentage > 0 ? price - (price * discountPercentage) / 100 : price;

    const product = new Product({
      name,
      categories,
      description,
      weight,
      price,
      offerPrice,
      discountPercentage,
      images,
      quantity,
      status,
    });

    await product.save();

    logger.info(`Product Created Successfully....Product Id: ${product._id}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req),
    });

    res.status(201).json({ success: true, message: "Product created successfully", product });

  } catch (error) {
    logger.error("Error creating product", {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: err.message,
      stack: err.stack,
      ...getLogMetadata(req),
    });

    res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};


// View product
exports.getProducts = async (req, res) => {
  try {
    logger.info("Fetching all products", {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req),
    });

    const products = await Product.find();

    if (!products || products.length === 0) {
      logger.warn("No products found", {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        ...getLogMetadata(req),
      });
      return res.status(404).json({ success: false, message: "No products found" });
    }

    logger.info(`Fetched ${products.length} Products`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req),
    });

    return res.status(200).json({ success: true, message: "Products fetched successfully", products });

  } catch (err) {
    logger.error("Error fetching products", {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: err.message,
      stack: err.stack,
      ...getLogMetadata(req),
    });

    return res.status(500).json({ success: false, message: "Error fetching products", error: err.message });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {
    let editid = req.params.id;
    const { name, categories, description, weight, price, removedImages = [], quantity, discountPercentage } = req.body;

    logger.info(`Received Updating Request for....Product ID: ${editid}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req)
    });

    const oldProduct = await Product.findById(editid);
    if (!oldProduct) {
      logger.warn(`Product ID: ${editid} not found`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        ...getLogMetadata(req)
      });
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Determine status based on quantity
    const status = quantity > 0 ? "Available" : "Out of Stock";
    const offerPrice = discountPercentage > 0 ? price - (price * discountPercentage) / 100 : price;

    let updatedData = { name, categories, description, weight, price, quantity, status, discountPercentage, offerPrice };

    // Remove undefined fields
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    const existingImages = oldProduct.images.filter(img => !removedImages.includes(img));

    deleteImages(removedImages);

    if (req.files && req.files.length > 0) {
      updatedData.images = [...existingImages, ...req.files.map(file => file.path)];
    } else {
      updatedData.images = existingImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(editid, updatedData, { new: true });

    logger.info(`Successfully Updated....Product ID: ${editid}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req)
    });

    res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });

  } catch (err) {
    logger.error(`Error updating product ID: ${req.params.id}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: err.message,
      stack: err.stack,
      ...getLogMetadata(req),
    });
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    logger.info(`Received Delete Request for....Product ID: ${productId}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req)
    });

    let product = await Product.findById(productId);
    if (!product) {
      logger.warn(`Not Found Product with ID: ${productId}`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        ...getLogMetadata(req)
      });
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    deleteImages(product.images);
    await Product.findByIdAndDelete(productId);
    logger.info(`Successfully Deleted....Product ID: ${productId}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req)
    });
    res.status(200).send({ success: true, message: "Product successfully deleted" });
  } catch (err) {
    logger.error(`Error deleting product ID: ${req.params.id}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: err.message,
      stack: err.stack,
      ...getLogMetadata(req)
    });
    res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// uplods in delete Images
const deleteImages = (images) => {
  images.forEach((imagePath) => {
    const fullPath = path.join(__dirname, "..", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting image: ${fullPath}`, err.message);
      } else {
        console.log(`Deleted image: ${fullPath}`);
      }
    });
  });
};