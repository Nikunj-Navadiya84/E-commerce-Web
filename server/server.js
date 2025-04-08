require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminRoutes = require("./routes/AdminRoutes");
const productRoutes = require("./routes/productRoutes");
const clientRoutes = require("./routes/clientRoutes");
const awardsRoutes = require("./routes/awardsRoutes");
const adminRoutes = require("./routes/adminlogRoutes");
const UserRoutes = require("./routes/UserRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const { connectDB } = require("./config/db");


const app = express();
const PORT = 4000;

connectDB();

// Apply CORS middleware with options

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Admin Login
app.use("/api/admin", AdminRoutes);

// Product
app.use("/api/products", productRoutes);

// Client
app.use("/api/client", clientRoutes);

// Awards
app.use("/api/awards", awardsRoutes);

// User Login
app.use("/api/user",  UserRoutes);

// Logs
app.use("/admin", adminRoutes);

// WishList
app.use("/api/wishlist", wishlistRoutes);

// Crat List
app.use('/api/cart', cartRoutes)

// Oredr List
app.use("api/order", OrderRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
