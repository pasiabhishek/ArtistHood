const express = require('express');
const router = express.Router();
const {
    getMyArtistProfile,
    getArtists,
    getArtistByUsername,
    updateArtistProfile
} = require('../controllers/artistController');

const { protect } = require('../middleware/auth');

router.get('/me', protect, getMyArtistProfile);      //fetch my artist profile
router.get('/', getArtists);                              //fetch all artists
router.get('/:username', getArtistByUsername);             //fetch artist by username
router.put('/update', protect, updateArtistProfile);      //update artist profile


module.exports = router;