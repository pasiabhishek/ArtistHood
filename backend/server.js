require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database.js");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("Artist Hood API Running");
});

// Server Listen
const PORT = process.env.PORT || 5000;


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database", error);
        process.exit(1);
    });