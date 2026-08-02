const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require("./config.js");

async function connectDB() {
    if (!config.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });

        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.warn("MongoDB Atlas connection failed, trying local in-memory database.", error.message);

        const memoryServer = await MongoMemoryServer.create();
        await mongoose.connect(memoryServer.getUri());
        console.log("Connected to local in-memory database");
    }
}

module.exports = connectDB;