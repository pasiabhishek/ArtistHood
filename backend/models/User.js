const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const PortfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
}, { _id: false });

const ArtistProfileSchema = new mongoose.Schema({
    category: { type: String, required: true },
    pricing: { type: Number, required: true },
    rating: { type: Number, default: 0.0 },
    portfolio: { type: [PortfolioSchema], default: [] },
}, { _id: false });

//user schema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['Client', 'Artist'], default: 'Client' },
    createdAt: { type: Date, default: Date.now },
    artistProfile: { type: ArtistProfileSchema, default: null },
});


// Hash password before saving, only if it was modified
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema, 'user');