const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: Number, required: true, min: 0, max: 5 },
    images: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);
