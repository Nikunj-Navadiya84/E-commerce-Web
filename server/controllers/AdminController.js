const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const logger = require("../Logger/logger");

const getLogMetadata = (req, user = null) => ({
  username: user ? user.id : "Unknown",
  ip: req.ip,
});


// Signup user
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`, {
        method: req.method,
        path: req.originalUrl,
        ...getLogMetadata(req, existingUser)
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Admin({ name, email, password: hashedPassword });
    await user.save();

    logger.info(`User registered successfully`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req, user)
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) { 
    logger.error(`Error registering user: ${error.message}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: error.message, 
      stack: error.stack,  
      ...getLogMetadata(req)
    });
    res.status(500).json({ message: "Error registering user" });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      logger.warn(`Login failed: User not found`, {
        method: req.method,
        path: req.originalUrl,
        ...getLogMetadata(req, { email })
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password`, {
        method: req.method,
        path: req.originalUrl,
        ...getLogMetadata(req, user)
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "90d" });

    logger.info(`User logged in successfully`, {
      method: req.method,
      path: req.originalUrl,
      ...getLogMetadata(req, user)
    });
    res.json({ token });
  } catch (error) {  // Corrected from err to error
    logger.error(`Login error: ${error.message}`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error: error.message, // Fixed variable name
      stack: error.stack,   // Fixed variable name
      ...getLogMetadata(req)
    });
    res.status(500).json({ message: "Login failed" });
  }
};


// Fetch users
exports.users = async (req, res) => {
  try {
    await Admin.find({}, 'name email');
    return res.status(200).send({
      success: true,
      message: "Users successfully fetched",
      email: req.user.email,
      LoginUserName: req.user.name
    });
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);

    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};


//Changepassword
exports.changepassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    logger.info(`Change password request `, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req, req.user)
    });

    // Find user by email
    let checkUser = await Admin.findOne({ email: email });
    if (!checkUser) {
      logger.warn(`Change password failed - User not found`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        ...getLogMetadata(req, req.user)
      });
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, checkUser.password);
    if (!passwordMatch) {
      logger.warn(`Incorrect old password for user`, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        ...getLogMetadata(req, req.user)
      });
      return res.status(400).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Check if old and new password are the same
    if (oldPassword === newPassword) {
      return res.status(400).send({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const updatedUser = await Admin.findByIdAndUpdate(
      checkUser._id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).send({
        success: false,
        message: "Error updating password",
      });
    }

    logger.info(`Password changed successfully for user`, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ...getLogMetadata(req, req.user)
    });
    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error(`Internal Server Error: ${error.message}`);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};