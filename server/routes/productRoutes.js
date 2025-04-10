const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const upload  = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/add",  upload.array("images", 10), createProduct);
router.get("/list",  getProducts);
router.put("/update/:id",  upload.array("images", 10), updateProduct);
router.delete("/delete/:id",  deleteProduct);

module.exports = router;                         
