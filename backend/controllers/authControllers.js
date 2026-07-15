const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (Client or Artist)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phoneNumber, role, category, pricing } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('An account with this email already exists');
    }

    const userData = {
        fullName,
        email,
        password,
        phoneNumber,
        role: role === 'Artist' ? 'Artist' : 'Client', // never allow self-registering as Admin
    };

    // If registering as an artist, require the basic artist profile fields up front
    if (role === 'Artist') {
        if (!category || !pricing) {
            res.status(400);
            throw new Error('Artists must provide a category and pricing on signup');
        }
        userData.artistProfile = { category, pricing };
    }

    const user = await User.create(userData);

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // password has `select: false` in the schema, so we explicitly ask for it here
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        },
    });
});

// @desc    Get logged-in user's own profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, getMe };
