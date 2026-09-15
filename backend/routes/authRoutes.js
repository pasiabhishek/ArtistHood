const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { createArtistProfile, getMyArtistProfile } = require('../controllers/artistController');
const { protect } = require('../middleware/auth');


router.post('/register', registerUser);
router.post('/artist-signup', protect, createArtistProfile);
router.get('/artist-profile', protect, getMyArtistProfile);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
