const { User, ArtistProfile } = require("../models/User");
const cloudinary = require("../config/cloudinary");

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

const getArtists = async (req, res) => {
    try {
        const artists = await ArtistProfile.find()
            .populate("user", "username fullName");

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

// Get Artist by Username
const getArtistByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
            role: "Artist"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Artist not found"
            });
        }

        const artistProfile = await ArtistProfile.findOne({
            user: user._id
        });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found"
            });
        }

        res.json({
            success: true,
            artist: {
                user,
                artistProfile
            }
        });

    } catch (error) {
        console.error("Get artist by username error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

//update artist profile
const updateArtistProfile = async (req, res) => {
    try {
        const {
            stageName, profileImage, category, bio, experience,
            city, state, availability, price, priceType,
            instagram, youtube, facebook, website
        } = req.body;

        const artistProfile = await ArtistProfile.findOne({ user: req.user.id });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found"
            });
        }

        // Update only fields that are provided
        if (stageName !== undefined) artistProfile.stageName = stageName;
        if (profileImage !== undefined) artistProfile.profileImage = profileImage;
        if (category !== undefined) artistProfile.category = category;
        if (bio !== undefined) artistProfile.bio = bio;
        if (experience !== undefined) artistProfile.experience = experience;
        if (city !== undefined) artistProfile.city = city;
        if (state !== undefined) artistProfile.state = state;
        if (availability !== undefined) artistProfile.availability = availability;
        if (price !== undefined) artistProfile.price = price;
        if (priceType !== undefined) artistProfile.priceType = priceType;
        if (instagram !== undefined) artistProfile.instagram = instagram;
        if (youtube !== undefined) artistProfile.youtube = youtube;
        if (facebook !== undefined) artistProfile.facebook = facebook;
        if (website !== undefined) artistProfile.website = website;

        await artistProfile.save();

        res.status(200).json({
            success: true,
            message: "Artist profile updated successfully",
            artistProfile
        });

    } catch (error) {
        console.error("Update artist profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateArtistProfileImage = async (req, res) => {
    try {

        const artistProfile = await ArtistProfile.findOne({ user: req.user.id });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required"
            });
        }

        // Upload image buffer to Cloudinary
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

        // Save Cloudinary URL
        artistProfile.profileImage = result.secure_url;

        await artistProfile.save();

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            profileImage: artistProfile.profileImage
        });

    } catch (error) {
        console.error("Update profile image error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createArtistProfile,
    getMyArtistProfile,
    getArtists,
    getArtistByUsername,
    updateArtistProfile,
    updateArtistProfileImage
};
