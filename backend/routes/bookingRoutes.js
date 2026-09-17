const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createBooking, getArtistBookings, getClientBookings } = require('../controllers/bookingController');

// Apply  protect middleware to all routes
router.use(protect);

router.post('/create-booking', createBooking);
router.get('/client-bookings', getClientBookings);
router.get('/artist-bookings', getArtistBookings);

module.exports = router;