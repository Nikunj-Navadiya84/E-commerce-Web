const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/", // Ensure the folder exists
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload; 
