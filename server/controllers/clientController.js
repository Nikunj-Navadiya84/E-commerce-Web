const fs = require("fs");
const Client = require("../models/Client");
const logger = require("../Logger/logger");
const cloudinary = require("../utils/cloudinary");

const getLogMetadata = (req) => ({
  username: req.user ? req.user.id : "Unknown",
  ip: req.ip,
});


// Create Client
exports.createClient = async (req, res) => {
  try {
    const { name, description, review } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(file.path); // Delete temp file
      }
    }

    const product = new Client({ name, description, review, images });

    await product.save();

    logger.info(`Product Created: ${product._id}`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req),
    });

    res
      .status(201)
      .json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    logger.error("Error creating product", {
      error: error.message,
      stack: error.stack,
      ...getLogMetadata(req),
    });
    res
      .status(500)
      .json({ success: false, message: "Error creating product", error: error.message });
  }
};


// Get Clients
exports.getClient = async (req, res) => {
  try {
    const client = await Client.find();
    if (!client.length)
      return res.status(404).json({ success: false, message: "No products found" });

    logger.info(`Fetched ${client.length} products`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req),
    });

    res.status(200).json({ success: true, message: "Products fetched", client });
  } catch (err) {
    logger.error("Error fetching products", {
      error: err.message,
      ...getLogMetadata(req),
    });
    res
      .status(500)
      .json({ success: false, message: "Error fetching products", error: err.message });
  }
};


// Update Client
exports.updateClient = async (req, res) => {
  try {
    const editid = req.params.id;

    const {
      name,
      description,
      review,
      removedImages = [],
    } = req.body;

    const removedImagesArray = Array.isArray(removedImages)
      ? removedImages
      : [removedImages];

    const oldProduct = await Client.findById(editid);
    if (!oldProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let existingImages = oldProduct.images;

    // If new images are uploaded, remove all old images from Cloudinary
    if (req.files && req.files.length > 0) {
      await Promise.all(
        oldProduct.images.map(async (img) => {
          try {
            await cloudinary.uploader.destroy(img.public_id);
            logger.info("Deleted old image from Cloudinary", { public_id: img.public_id });
          } catch (cloudErr) {
            logger.warn("Failed to delete old image", {
              public_id: img.public_id,
              error: cloudErr.message,
            });
          }
        })
      );

      existingImages = []; // Clear image array

      // Upload new images
      for (let file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          });

          existingImages.push({
            url: result.secure_url,
            public_id: result.public_id,
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
    } else {
      // If no new images uploaded, remove only selected ones
      if (removedImagesArray.length > 0) {
        const validRemovedImages = oldProduct.images
          .filter((img) => removedImagesArray.includes(img.public_id))
          .map((img) => img.public_id);

        await Promise.all(
          validRemovedImages.map(async (public_id) => {
            try {
              await cloudinary.uploader.destroy(public_id);
              logger.info("Deleted image from Cloudinary", { public_id });
            } catch (cloudErr) {
              logger.warn("Failed to delete image from Cloudinary", {
                public_id,
                error: cloudErr.message,
              });
            }
          })
        );

        existingImages = oldProduct.images.filter(
          (img) => !removedImagesArray.includes(img.public_id)
        );
      }
    }

    const updatedData = {
      name,
      description,
      review,
      images: existingImages,
    };

    // Remove undefined fields
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const updatedProduct = await Client.findByIdAndUpdate(editid, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    logger.error("Error updating product", {
      error: err.message,
      ...getLogMetadata(req),
    });
    res
      .status(500)
      .json({ success: false, message: "Error updating product", error: err.message });
  }
};



// Delete Client
exports.deleteClient = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Client.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Delete all images from Cloudinary
    for (let img of product.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
        logger.info("Deleted image from Cloudinary", { public_id: img.public_id });
      } catch (cloudErr) {
        logger.warn("Failed to delete image from Cloudinary", {
          public_id: img.public_id,
          error: cloudErr.message,
        });
      }
    }

    await Client.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    logger.error("Error deleting product", {
      error: err.message,
      ...getLogMetadata(req),
    });
    res
      .status(500)
      .json({ success: false, message: "Error deleting product", error: err.message });
  }
};
