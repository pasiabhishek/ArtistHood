const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        caption: {
            type: String,
            default: ""
        },

        media: {
            type: String,
            required: true
        },

        mediaType: {
            type: String,
            enum: ["image", "video", "audio"],
            required: true
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);




/*
POST COLLECTION
Post
├── _id
├── artist → User._id
├── caption
├── media
├── mediaType
├── likes[]
└── timestamps
*/
