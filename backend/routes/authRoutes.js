const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { createArtistProfile, getMyArtistProfile, getAllArtists } = require('../controllers/artistController');
const { protect } = require('../middleware/auth');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.post('/artist-signup', protect, createArtistProfile);
router.get('/artist-profile', protect, getMyArtistProfile);
router.get('/artists', getAllArtists);


module.exports = router;
