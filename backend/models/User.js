const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// User schema 
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['Client', 'Artist'],
        default: 'Client'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Artist profile schema
const ArtistProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 30,
            match: /^[a-zA-Z0-9_]+$/,
        },
        stageName: {
            type: String,
            required: true,
            trim: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        priceType: {
            type: String,
            enum: ["event", "hour", "day"],
            default: "event",
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        instagram: {
            type: String,
            default: "",
            trim: true,
        },
        youtube: {
            type: String,
            default: "",
            trim: true,
        },
        facebook: {
            type: String,
            default: "",
            trim: true,
        },
        website: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password middleware
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Compile user model
const User = mongoose.model('User', UserSchema, 'user');

// Compile artist model
const ArtistProfile = mongoose.model('ArtistProfile', ArtistProfileSchema);

module.exports = { User, ArtistProfile };