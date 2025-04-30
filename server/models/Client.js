const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    images: [
        {
          url: String,
          public_id: String,
        }
      ],
    name: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: Number, required: true, min: 0, max: 5 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);
