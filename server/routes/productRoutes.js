const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const upload  = require("../middleware/uploadMiddleware");
const { AdminMiddleware } = require("../middleware/AdminMiddleware");

const router = express.Router();

router.post("/add", AdminMiddleware, upload.array("images", 10), createProduct);
router.get("/list",  getProducts);
router.put("/update/:id", AdminMiddleware, upload.array("images", 10), updateProduct);
router.delete("/delete/:id", AdminMiddleware, deleteProduct);

module.exports = router;                         
