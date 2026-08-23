const User = require("../models/User");

const createArtistProfile = async (req, res) => {
    try {
        // User comes from authentication middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Only artists can create artist profiles
        if (user.role !== "Artist") {
            return res.status(403).json({
                message: "Only artists can create an artist profile"
            });
        }

        // Get profile data from request
        user.artistProfile = {
            stageName: req.body.stageName,
            category: req.body.category,
            bio: req.body.bio,
            experience: req.body.experience,
            city: req.body.city,
            state: req.body.state,
            availability: req.body.availability,
            price: req.body.price,
            priceType: req.body.priceType,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            website: req.body.website,
            portfolio: req.body.portfolio || []
        };


        // Create embedded artist profile
        user.artistProfile = {
            stageName,
            category,
            bio,
            experience,
            city,
            state,
            availability,
            pricing,
            priceType,
            instagram,
            youtube,
            website,
            portfolio: portfolio || []
        };

        await user.save();

        res.status(201).json({
            success: true,
            message: "Artist created ",
            artistProfile: user.artistProfile
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createArtistProfile
};
