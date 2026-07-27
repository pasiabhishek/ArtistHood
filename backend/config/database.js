const mongoose = require("mongoose");
const config = require("./config.js");

async function connectDB() {

    await mongoose.connect(config.MONGO_URI)

    console.log("Connected to Database")
}

module.exports = connectDB;