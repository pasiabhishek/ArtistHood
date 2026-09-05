const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// add profile pic 

const ArtistProfileSchema = new mongoose.Schema(
    {
        stageName: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
            required: true,
            minlength: 40,
            maxlength: 500,
        },

        experience: {
            type: Number,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        availability: {
            type: Date,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        priceType: {
            type: String,
            enum: ["per event", "per hour", "per day"],
            default: "per event",
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        instagram: {
            type: String,
            default: "",
        },

        youtube: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);



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

/*
// User Schema Structure
User
│
├── fullName
├── email
├── password
├── role
│
└── artistProfile
    ├── stageName
    ├── category
    ├── bio
    ├── experience
    ├── city
    ├── state
    ├── availability
    ├── price
    └── social links


//post Schema Structure
Post
│
├── artist → User
├── caption
├── media[]
├── isPortfolio
├── likes[]
└── timestamps
*/