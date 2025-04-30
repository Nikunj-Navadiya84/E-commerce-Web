const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { createClient, getClient, updateClient, deleteClient} = require("../controllers/clientController");


const router = express.Router();

router.post("/add",  upload.array("images", 1), createClient);
router.get("/list", getClient);
router.put("/update/:id",  upload.array("images", 1), updateClient);
router.delete("/delete/:id", deleteClient);


module.exports = router;