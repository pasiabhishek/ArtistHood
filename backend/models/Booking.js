const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ArtistProfile",
            required: true,
        },

        eventDate: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
            trim: true,
        },

        endTime: {
            type: String,
            required: true,
            trim: true,
        },

        eventType: {
            type: String,
            required: true,
            trim: true,
        },
        expectedGuests: {
            type: Number,
            required: true,
            min: 1,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "confirmed",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

//for artist booking queries
bookingSchema.index({
    artist: 1,
    eventDate: 1,
    status: 1,
});

// for client booking history
bookingSchema.index({
    client: 1,
    createdAt: -1,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
