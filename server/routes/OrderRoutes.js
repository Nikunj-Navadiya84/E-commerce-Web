const express = require("express");
const { placeOrder, updateStatus, allOrder, placeOrderStripe, userOrder, verifyStripe } = require("../controllers/OrderControllers");
const { AdminMiddleware } = require("../middleware/AdminMiddleware");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/list", AdminMiddleware, allOrder)
router.post("/status", AdminMiddleware, updateStatus)

router.post("/place", userMiddleware, placeOrder)
router.post("/stripe", userMiddleware, placeOrderStripe)

router.post("/userorders", userMiddleware, userOrder)
router.post("/verifyStripe", userMiddleware, verifyStripe)


module.exports = router;