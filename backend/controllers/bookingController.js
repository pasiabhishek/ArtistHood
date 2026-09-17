const Booking = require("../models/Booking");
const { User, ArtistProfile } = require("../models/User");


// Convert HH:mm into minutes
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};


// Create Booking
const createBooking = async (req, res) => {
    try {
        const {
            artist,
            eventDate,
            startTime,
            endTime,
            eventType,
            expectedGuests,
            description,
        } = req.body;

        // Only clients can create bookings
        if (req.user.role !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Only clients can create bookings",
            });
        }

        // find artist Profile
        const artistProfile = await ArtistProfile.findById(artist);

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        // client cannot book themselves
        if (req.user.id === artistProfile.user.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot book yourself",
            });
        }

        // Artist must have availableFrom
        if (!artistProfile.availableFrom) {
            return res.status(400).json({
                success: false,
                message: "Artist has not set an availability date",
            });
        }

        // Validate event date
        if (!eventDate) {
            return res.status(400).json({
                success: false,
                message: "Event date is required",
            });
        }

        const requestedDate = new Date(
            `${eventDate}T00:00:00.000Z`
        );

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid event date",
            });
        }

        // Normalize availableFrom
        const availableDate = new Date(artistProfile.availableFrom);
        availableDate.setUTCHours(0, 0, 0, 0);

        // Event cannot be before artist availability
        if (requestedDate < availableDate) {
            return res.status(400).json({
                success: false,
                message: "Artist is not available on this date",
            });
        }

        // Event cannot be in the past
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot create bookings for past dates",
            });
        }

        // Validate time format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid time format. Use HH:mm",
            });
        }

        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);

        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time",
            });
        }

        // Validate required fields
        if (!eventType || !description || !expectedGuests) {
            return res.status(400).json({
                success: false,
                message: "Event type, description and expected guests are required",
            });
        }

        const booking = await Booking.create({
            client: req.user.id,
            artist: artist, // Use the artist ID from the request body
            eventDate: requestedDate,
            startTime,
            endTime,
            eventType,
            expectedGuests,
            description,
            price: artistProfile.price,
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Booking request created successfully",
            booking,
        });

    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
};

// Get Artist's Incoming Bookings
const getArtistBookings = async (req, res) => {
    try {
        // Validate artist role
        if (req.user.role !== "Artist") {
            return res.status(403).json({
                success: false,
                message: "Only artists can access incoming bookings",
            });
        }

        // Fetch artist profile
        const artistProfile = await ArtistProfile.findOne({ user: req.user.id });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        // Fetch artist bookings
        const bookings = await Booking.find({
            artist: artistProfile._id,
        })
            .populate("client", "fullName email")
            .sort({
                eventDate: 1,
                startTime: 1,
            });

        return res.status(200).json({
            success: true,
            bookings,
        });

    } catch (error) {
        console.error("Get artist bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get artist bookings",
        });
    }
};

// Get Client's Bookings
const getClientBookings = async (req, res) => {
    try {
        // Validate client role
        if (req.user.role !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Only clients can access client bookings",
            });
        }

        // Fetch client bookings
        const bookings = await Booking.find({
            client: req.user.id,
        })
            .populate({
                path: "artist",
                select: "stageName profileImage category price",
                populate: {
                    path: "user",
                    select: "fullName email",
                },
            })
            .sort({
                eventDate: 1,
                startTime: 1,
            });

        return res.status(200).json({
            success: true,
            bookings,
        });

    } catch (error) {
        console.error("Get client bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get client bookings",
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("client", "fullName email")
            .populate({
                path: "artist",
                select:
                    "stageName category profileImage city state price priceType user",
                populate: {
                    path: "user",
                    select: "fullName email",
                },
            });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Client check
        const isClient =
            booking.client._id.toString() === req.user.id;

        // Artist check
        const isArtist =
            booking.artist.user._id.toString() === req.user.id;

        // Only booking participants
        if (!isClient && !isArtist) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this booking",
            });
        }

        return res.status(200).json({
            success: true,
            booking,
        });

    } catch (error) {
        console.error("Get booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get booking",
        });
    }
};

module.exports = {
    createBooking,
    getArtistBookings,
    getClientBookings,
    getBookingById,
};