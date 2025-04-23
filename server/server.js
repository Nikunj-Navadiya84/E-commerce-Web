require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminlogRoutes");
const UserRoutes = require("./routes/UserRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const AddressRoutes = require("./routes/AddressRoutes");
const { connectDB } = require("./config/db");
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
 
// Apply CORS middleware with options

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Product
app.use("/api/products", productRoutes);

// Client
app.use("/api/client", clientRoutes);

// User Login
app.use("/api/user",  UserRoutes);

// Logs
app.use("/admin", adminRoutes);

// WishList
app.use("/api/wishlist", wishlistRoutes);

// Crat List
app.use('/api/cart', cartRoutes)

// Oredr List
app.use("/api/order", orderRoutes)

// Address
app.use("/api/address", AddressRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
