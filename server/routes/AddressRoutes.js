const express = require("express");
const { createAddress, getAllAddresses, deleteAddress } = require("../controllers/AddressController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/add",userMiddleware, createAddress);
router.get("/get",userMiddleware, getAllAddresses);
router.delete("/delete/:id",userMiddleware, deleteAddress);

module.exports = router;
