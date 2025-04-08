const express = require("express");
const { signup, login, users, changepassword } = require("../controllers/UserController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/users', userMiddleware, users);
router.post('/changepassword', userMiddleware, changepassword);

module.exports = router;