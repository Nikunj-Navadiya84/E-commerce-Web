const mongoose = require("mongoose");
const { Types } = mongoose;

const clientSchema = new mongoose.Schema({
  productId: { type: Types.ObjectId, ref: "Product" },
  description: { type: String, required: true },
  review: { type: Number, required: true, min: 0, max: 5 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);


