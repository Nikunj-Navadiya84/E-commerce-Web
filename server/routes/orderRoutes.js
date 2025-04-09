const express = require("express");
const { placeOrder } = require("../controllers/oderController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/place", userMiddleware, placeOrder);

module.exports = router;
