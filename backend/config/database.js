const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require("./config.js");

async function connectDB() {
    const mongoUri = config.MONGO_URI || process.env.MONGO_URI;

    const connectWithUri = async (uri, label) => {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 60000,
        });

        console.log(`Connected to ${label}`);
    };

    if (mongoUri) {
        try {
            await connectWithUri(mongoUri, "MongoDB Atlas");
            return;
        } catch (error) {
            console.error("MongoDB Atlas connection failed.");
            console.error("Please verify your MONGO_URI, Atlas cluster status, and IP whitelist.");
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            throw error;
        }
    }

    console.warn("MONGO_URI is not defined. Falling back to an in-memory MongoDB instance.");

    try {
        const mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        await connectWithUri(fallbackUri, "in-memory MongoDB");
        process.env.MONGO_URI = fallbackUri;
    } catch (error) {
        console.error("MongoDB connection failed and fallback failed.");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        throw error;
    }
}

module.exports = connectDB;