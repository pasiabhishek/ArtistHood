const Booking = require("../models/Booking");
const { ArtistProfile } = require("../models/User");
const { notify } = require("../utils/notify");

const ACTIVE_STATUSES = ["pending", "accepted", "confirmed"];

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const timesOverlap = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
};

const dayRange = (date) => {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
};

const populateBooking = (id) =>
    Booking.findById(id)
        .populate("client", "fullName email username")
        .populate({
            path: "artist",
            select: "stageName category profileImage city state price priceType user",
            populate: {
                path: "user",
                select: "fullName email username",
            },
        });

const hasScheduleConflict = async ({
    artistId,
    eventDate,
    startTime,
    endTime,
    excludeId,
}) => {
    const { start, end } = dayRange(eventDate);
    const query = {
        artist: artistId,
        eventDate: { $gte: start, $lt: end },
        status: { $in: ACTIVE_STATUSES },
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const existing = await Booking.find(query).select("startTime endTime");
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return existing.some((item) =>
        timesOverlap(
            startMinutes,
            endMinutes,
            timeToMinutes(item.startTime),
            timeToMinutes(item.endTime)
        )
    );
};

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
            location,
        } = req.body;

        if (req.user.role !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Only clients can create bookings",
            });
        }

        const artistProfile = await ArtistProfile.findById(artist);

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        if (req.user.id === artistProfile.user.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot book yourself",
            });
        }

        if (!artistProfile.availableFrom) {
            return res.status(400).json({
                success: false,
                message: "Artist has not set an availability date",
            });
        }

        if (!eventDate) {
            return res.status(400).json({
                success: false,
                message: "Event date is required",
            });
        }

        const venue = String(location || "").trim();
        if (!venue) {
            return res.status(400).json({
                success: false,
                message: "Venue / location is required",
            });
        }

        const requestedDate = new Date(`${eventDate}T00:00:00.000Z`);

        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid event date",
            });
        }

        const availableDate = new Date(artistProfile.availableFrom);
        availableDate.setUTCHours(0, 0, 0, 0);

        if (requestedDate < availableDate) {
            return res.status(400).json({
                success: false,
                message: "Artist is not available on this date",
            });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot create bookings for past dates",
            });
        }

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

        if (!eventType || !description || !expectedGuests) {
            return res.status(400).json({
                success: false,
                message: "Event type, description and expected guests are required",
            });
        }

        const conflict = await hasScheduleConflict({
            artistId: artist,
            eventDate: requestedDate,
            startTime,
            endTime,
        });

        if (conflict) {
            return res.status(409).json({
                success: false,
                message: "This artist already has a booking that overlaps this time",
            });
        }

        const booking = await Booking.create({
            client: req.user.id,
            artist,
            eventDate: requestedDate,
            startTime,
            endTime,
            eventType,
            expectedGuests,
            description,
            location: venue,
            price: artistProfile.price,
            status: "pending",
        });

        await notify({
            user: artistProfile.user,
            type: "booking_created",
            title: "New booking request",
            body: `${req.user.fullName || "A client"} requested ${eventType} on ${eventDate} at ${venue}.`,
            href: `/booking/${booking._id}`,
            booking: booking._id,
        });

        const populated = await populateBooking(booking._id);

        return res.status(201).json({
            success: true,
            message: "Booking request created successfully",
            booking: populated,
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
};

const getArtistBookings = async (req, res) => {
    try {
        if (req.user.role !== "Artist") {
            return res.status(403).json({
                success: false,
                message: "Only artists can access incoming bookings",
            });
        }

        const artistProfile = await ArtistProfile.findOne({ user: req.user.id });

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        const bookings = await Booking.find({
            artist: artistProfile._id,
        })
            .populate("client", "fullName email username")
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

const getClientBookings = async (req, res) => {
    try {
        if (req.user.role !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Only clients can access client bookings",
            });
        }

        const bookings = await Booking.find({
            client: req.user.id,
        })
            .populate({
                path: "artist",
                select: "stageName profileImage category price",
                populate: {
                    path: "user",
                    select: "fullName email username",
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
        const booking = await populateBooking(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const isClient = booking.client._id.toString() === req.user.id;
        const isArtist = booking.artist.user._id.toString() === req.user.id;

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

const acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate(
            "artist",
            "user"
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.artist.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned artist can accept this booking",
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be accepted",
            });
        }

        const conflict = await hasScheduleConflict({
            artistId: booking.artist._id,
            eventDate: booking.eventDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            excludeId: booking._id,
        });

        if (conflict) {
            return res.status(409).json({
                success: false,
                message: "This time overlaps another accepted or pending booking",
            });
        }

        booking.status = "accepted";
        await booking.save();

        await notify({
            user: booking.client,
            type: "booking_accepted",
            title: "Booking accepted",
            body: "Your booking was accepted. Pay to confirm the event.",
            href: `/booking/${booking._id}`,
            booking: booking._id,
        });

        const populated = await populateBooking(booking._id);

        return res.status(200).json({
            success: true,
            message: "Booking accepted successfully",
            booking: populated,
        });
    } catch (error) {
        console.error("Accept booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to accept booking",
        });
    }
};

const rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate(
            "artist",
            "user"
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.artist.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the assigned artist can reject this booking",
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be rejected",
            });
        }

        booking.status = "rejected";
        await booking.save();

        await notify({
            user: booking.client,
            type: "booking_rejected",
            title: "Booking declined",
            body: "The artist declined this booking request.",
            href: `/booking/${booking._id}`,
            booking: booking._id,
        });

        const populated = await populateBooking(booking._id);

        return res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            booking: populated,
        });
    } catch (error) {
        console.error("Reject booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reject booking",
        });
    }
};

module.exports = {
    createBooking,
    getArtistBookings,
    getClientBookings,
    getBookingById,
    acceptBooking,
    rejectBooking,
};
