const { User, ArtistProfile } = require("../models/User");

const createArtistProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "Artist") {
            return res.status(403).json({
                success: false,
                message: "Only artists can create an artist profile"
            });
        }

        const existingProfile = await ArtistProfile.findOne({
            user: user._id
        });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Artist profile already exists"
            });
        }

        const artistProfile = await ArtistProfile.create({
            user: user._id,

            stageName: req.body.stageName,
            profileImage: req.body.profileImage,
            category: req.body.category,
            bio: req.body.bio,
            experience: req.body.experience,
            city: req.body.city,
            state: req.body.state,
            availability: req.body.availability,
            price: req.body.price,
            priceType: req.body.priceType,

            // Server controlled
            rating: 0,
            isVerified: false,

            instagram: req.body.instagram,
            youtube: req.body.youtube,
            facebook: req.body.facebook,
            website: req.body.website
        });

        return res.status(201).json({
            success: true,
            message: "Artist profile created successfully",
            artistProfile
        });

    } catch (error) {
        console.error("Create artist profile error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get My Artist Profile
const getMyArtistProfile = async (req, res) => {
    try {
        const artistProfile = await ArtistProfile.findOne({
            user: req.user.id
        });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found"
            });
        }

        res.json({
            success: true,
            artistProfile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllArtists = async (req, res) => {
    try {
        const artists = await ArtistProfile.find();

        res.json({
            success: true,
            artists
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createArtistProfile,
    getMyArtistProfile,
    getAllArtists
};
