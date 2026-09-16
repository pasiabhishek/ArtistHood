const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { createArtistProfile } = require('../controllers/artistController');
const { protect } = require('../middleware/authMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.post('/artist-signup', protect, createArtistProfile);     //create artist profile


module.exports = router;
