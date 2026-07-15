const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// Portfolio/Post Sub-Schema
const PortfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video', 'audio'], required: true },
    uploadDate: { type: Date, default: Date.now },

    // Social Engagement Fields
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
});

// Artist Profile Sub-Schema
const ArtistProfileSchema = new mongoose.Schema({
    category: { type: String, required: true }, // e.g. Singer, DJ, Painter, Photographer
    profileImage: { type: String },
    bio: { type: String },
    experience: { type: Number, default: 0 },
    availabilityStatus: { type: String, enum: ['Available', 'Booked'], default: 'Available' },
    pricing: { type: Number, required: true },
    rating: { type: Number, default: 0.0 },
    isVerified: { type: Boolean, default: false },
    portfolio: [PortfolioSchema],
});


//user schema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phoneNumber: { type: String },
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

module.exports = mongoose.model('User', UserSchema);