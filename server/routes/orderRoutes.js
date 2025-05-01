const express = require("express");
const { placeOrder, userOrder, allOrder, updateStatus, totalpaid } = require("../controllers/oderController");
const { userMiddleware } = require("../middleware/UserMiddleware");


const router = express.Router();

router.post("/place", userMiddleware, placeOrder);

router.post("/userOrder", userMiddleware, userOrder);

router.get("/allOrder", allOrder);
router.post("/updateStatus",  updateStatus);

router.get("/paid", totalpaid);



module.exports = router;
