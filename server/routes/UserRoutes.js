const express = require("express");
const { signup, login, users, changepassword, adminLogin} = require("../controllers/UserController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/users', userMiddleware, users);
router.post('/changepassword', userMiddleware, changepassword);

router.post('/admin', adminLogin);

module.exports = router;