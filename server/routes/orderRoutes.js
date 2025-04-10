const express = require("express");
const { placeOrder, userOrder, allOrder, updateStatus } = require("../controllers/oderController");
const { userMiddleware } = require("../middleware/UserMiddleware");


const router = express.Router();

router.post("/place", userMiddleware, placeOrder);

router.post("/userOrder", userMiddleware, userOrder);

router.get("/allOrder", allOrder);
router.post("/updateStatus",  updateStatus);



module.exports = router;
