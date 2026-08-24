const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
}, { _id: false });

module.exports = PortfolioSchema;