const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/authMiddleware');
const { createBooking } = require('../controllers/bookingController');

// Apply the protect middleware to all routes in this router
router.use(protect);

router.post('/create-booking', createBooking);

module.exports = router;