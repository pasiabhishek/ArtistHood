const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require("./config.js");

async function connectDB() {
    try {
        if (config.MONGO_URI) {
            await mongoose.connect(config.MONGO_URI);
            console.log("Connected to Database");
            return;
        }
    } catch (error) {
        console.warn("Primary MongoDB connection failed, falling back to local in-memory database.", error.message);
    }

    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log("Connected to local in-memory database");
}

module.exports = connectDB;