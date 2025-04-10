const Address = require("../models/Address");
const logger = require("../Logger/logger");

const getLogMetadata = (req, user = null) => ({
  username: user ? user._id : "Unknown",
  method: req.method,
  path: req.originalUrl,
  ip: req.ip,
});


// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { user, address } = req.body;
    const newAddress = new Address({ user, address });
    await newAddress.save();

    logger.info("Address created successfully", getLogMetadata(req, { _id: user }));

    res.status(201).json(newAddress);
  } catch (err) {
    logger.error(`Error creating address: ${err.message}`, getLogMetadata(req));
    res.status(500).json({ error: err.message });
  }
};


// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ user: userId });

    logger.info("Fetched all addresses", getLogMetadata(req, req.user));

    res.status(200).json({ addresses });
  } catch (err) {
    logger.error(`Error fetching addresses: ${err.message}`, getLogMetadata(req, req.user));
    res.status(500).json({ error: err.message });
  }
};


// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);
    if (!deleted) {
      logger.warn("Attempted to delete non-existing address", getLogMetadata(req, req.user));
      return res.status(404).json({ message: "Address not found" });
    }

    logger.info("Address deleted successfully", getLogMetadata(req, req.user));
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting address: ${err.message}`, getLogMetadata(req, req.user));
    res.status(500).json({ error: err.message });
  }
};
