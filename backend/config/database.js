const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB() {
    if (!config.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 60000,
        });

        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB Atlas connection failed.");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw error;
    }
}

module.exports = connectDB;