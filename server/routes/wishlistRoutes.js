const express = require("express");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/addwishlist", userMiddleware, addToWishlist);
router.get("/getwishlist", userMiddleware, getWishlist);
router.delete("/removewishlist", userMiddleware, removeFromWishlist);

module.exports = router;
