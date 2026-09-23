const { User, ArtistProfile } = require("../models/User");
const generateToken = require("../utils/generateToken");
const cloudinary = require("../config/cloudinary");



// Register User
const registerUser = async (req, res) => {
    try {
        const { fullName, username, password, role } = req.body;
        const normalizedFullName = fullName?.trim();
        const normalizedUsername = username?.trim().toLowerCase();
        const normalizedEmail = req.body.email?.trim().toLowerCase();

        if (!normalizedFullName || !normalizedUsername || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (!role || !["Client", "Artist"].includes(role)) {
            return res.status(400).json({
                message: "Please select a valid role"
            });
        }

        const userExists = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
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
            fullName: normalizedFullName,
            username: normalizedUsername,
            email: normalizedEmail,
            password,
            role
        });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token
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
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

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

        const token = generateToken(user._id);

        res.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch (error) {
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({
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

//update user profile image 
const updateProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required"
            });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "artistHood/ProfileImages",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(req.file.buffer);
        });

        const imageUrl = result.secure_url;

        // Update User image
        user.profileImage = imageUrl;

        // If user is an artist, update ArtistProfile too
        if (user.role === "Artist") {

            const artistProfile = await ArtistProfile.findOne({
                user: user._id
            });

            if (artistProfile) {
                artistProfile.profileImage = imageUrl;
                await artistProfile.save();
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            profileImage: imageUrl
        });

    } catch (error) {
        console.error("Update profile image error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfileImage
};