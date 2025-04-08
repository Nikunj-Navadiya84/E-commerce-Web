const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { createAwards, getAwards, updateAwards, deleteAwards} = require("../controllers/awardsController");
const { AdminMiddleware } = require("../middleware/AdminMiddleware");

const router = express.Router();

router.post("/add", AdminMiddleware, upload.single("images"), createAwards);
router.get("/list", AdminMiddleware, getAwards);
router.put("/update/:id", AdminMiddleware, upload.single("images"), updateAwards);
router.delete("/delete/:id", AdminMiddleware, deleteAwards);


module.exports = router;