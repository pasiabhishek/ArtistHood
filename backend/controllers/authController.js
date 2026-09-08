const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// Register User
const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body;
        const normalizedUsername = username?.trim().toLowerCase();

        if (!fullName || !normalizedUsername || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { username: normalizedUsername }]
        });

        if (userExists) {
            const message = userExists.username === normalizedUsername
                ? "Username is already taken"
                : "User already exists";
            return res.status(400).json({
                message
            });
        }

        const user = await User.create({
            fullName,
            username: normalizedUsername,
            email,
            password,
            role: role || "Client",
            artistProfile: null
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            return res.status(400).json({
                message: field === "username"
                    ? "Username is already taken"
                    : "User already exists"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get Current User
const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe
};