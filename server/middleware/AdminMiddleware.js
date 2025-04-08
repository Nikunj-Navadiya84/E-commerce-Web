const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.AdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Invalid Token" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication Failed" });
  }
};
