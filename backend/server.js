require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database.js");

const app = express();

// Database connection
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Health Check Route
app.post("/login", (req, res) => {
    res.send("Artist Hood API Running");
});

// Server Listenc
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});