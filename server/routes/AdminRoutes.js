const express = require("express");
const { signup, login, users, changepassword } = require("../controllers/AdminController");
const { AdminMiddleware } = require("../middleware/AdminMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/users', AdminMiddleware, users);
router.post('/changepassword', AdminMiddleware, changepassword);

module.exports = router;