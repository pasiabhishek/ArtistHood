const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const artist = req.user._id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Media file is required",
            });
        }

        let mediaType;

        if (req.file.mimetype.startsWith("image/")) {
            mediaType = "image";
        } else if (req.file.mimetype.startsWith("video/")) {
            mediaType = "video";
        } else if (req.file.mimetype.startsWith("audio/")) {
            mediaType = "audio";
        } else {
            return res.status(400).json({
                success: false,
                message: "Only image, video and audio files are allowed",
            });
        }
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "artistHood/Posts",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        const post = await Post.create({
            artist,
            caption,
            media: result.secure_url,
            mediaType,
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createPost };