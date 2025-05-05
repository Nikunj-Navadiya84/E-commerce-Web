const express = require("express");
const { signup, login, users, changepassword, adminLogin,blockUser,unblockUser, usertotal} = require("../controllers/UserController");
const { userMiddleware } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/users', userMiddleware, users);
router.post('/changepassword', userMiddleware, changepassword);
router.get("/all", usertotal);
router.put('/block/:id', blockUser);
router.put('/unblock/:id', unblockUser);

router.post('/admin', adminLogin);

module.exports = router;