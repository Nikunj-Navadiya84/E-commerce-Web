const express = require("express");
const { addToCart, getCart, removeFromCart, updateQuantityInCart, clearCart} = require("../controllers/cartController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/addcart", userMiddleware, addToCart);          
router.get("/getcart", userMiddleware, getCart);           
router.delete("/removecart", userMiddleware, removeFromCart); 
router.put("/updatecart", userMiddleware, updateQuantityInCart);
router.delete("/clearCart",userMiddleware, clearCart)

module.exports = router;
