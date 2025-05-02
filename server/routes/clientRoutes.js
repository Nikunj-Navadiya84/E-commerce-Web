const express = require("express");
const { createClient, getClient, updateClient, deleteClient} = require("../controllers/clientController");


const router = express.Router();

router.post("/add", createClient);
router.get("/list/:productId", getClient);
router.put("/update/:id", updateClient);
router.delete("/delete/:id", deleteClient);


module.exports = router;