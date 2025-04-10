const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { createClient, getClient, updateClient, deleteClient} = require("../controllers/clientController");


const router = express.Router();

router.post("/add",  upload.single("images"), createClient);
router.get("/list", getClient);
router.put("/update/:id",  upload.single("images"), updateClient);
router.delete("/delete/:id", deleteClient);


module.exports = router;