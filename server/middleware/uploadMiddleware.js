const multer = require('multer');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../uploads');

// Ensure temp folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

module.exports = multer({ storage });
