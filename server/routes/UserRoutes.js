const express = require("express");
const { signup, login, users, changepassword, adminLogin, usertotal} = require("../controllers/UserController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/users', userMiddleware, users);
router.post('/changepassword', userMiddleware, changepassword);
router.get("/all", usertotal);

router.post('/admin', adminLogin);

module.exports = router;