const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { artistProfile } = require('../controllers/artistController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/artist-profile', protect, artistProfile);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
