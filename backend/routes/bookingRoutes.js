const express = require('express');
const router = express.Router();
const {
} = require('../controllers/bookingController');

router.post('/', protect, authorize('Client'), createBooking);

module.exports = router;
