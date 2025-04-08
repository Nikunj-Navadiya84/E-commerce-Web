const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { createClient, getClient, updateClient, deleteClient} = require("../controllers/clientController");
const { AdminMiddleware } = require("../middleware/AdminMiddleware");


const router = express.Router();

router.post("/add", AdminMiddleware, upload.single("images"), createClient);
router.get("/list",  getClient);
router.put("/update/:id", AdminMiddleware, upload.single("images"), updateClient);
router.delete("/delete/:id", AdminMiddleware, deleteClient);


module.exports = router;