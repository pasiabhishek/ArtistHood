const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createBooking, getArtistBookings, getClientBookings,
    getBookingById, acceptBooking } = require('../controllers/bookingController');

// Apply  protect middleware to all routes
router.use(protect);

router.post('/create-booking', createBooking);
router.get('/client-bookings', getClientBookings);
router.get('/artist-bookings', getArtistBookings);
router.get('/:id', getBookingById);
router.put('/:id/accept', acceptBooking);

module.exports = router;