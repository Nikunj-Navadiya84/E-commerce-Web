const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: Object, required: true },
});

module.exports = mongoose.model("Address", AddressSchema);