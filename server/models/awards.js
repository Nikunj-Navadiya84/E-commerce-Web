const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    images: { type: String, required: true },
    category: { type: String, required: true }, 
    state: { type: String, required: true }, 
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Award", awardSchema);