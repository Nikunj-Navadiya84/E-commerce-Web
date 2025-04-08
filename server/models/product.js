const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  images: { type: [String], required: true },
  name: { type: String, required: true },
  categories: { type: String, required: true },
  description: { type: String, required: true },
  weight:{type: String, required: true},
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  offerPrice: { type: Number },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
});

// Middleware to calculate offer price before saving
productSchema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "Available" : "Out of Stock";

  // Calculate offer price if a discount is applied
  this.offerPrice = this.discountPercentage > 0
    ? this.price - (this.price * this.discountPercentage) / 100
    : this.price;

  next();
});

module.exports = mongoose.model("Product", productSchema);

