const express = require('express');
const router = express.Router();
const {
    getMyArtistProfile,
    getArtists,
    getArtistByUsername,
    updateArtistProfile
} = require('../controllers/artistController');

const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyArtistProfile);      //fetch my artist profile
router.get('/', getArtists);                              //fetch all artists
router.get('/:username', getArtistByUsername);             //fetch artist by username
router.put('/update', protect, updateArtistProfile);      //update artist profile



module.exports = router;


/**
 * Artist API Endpoints
 *
 * GET  /api/artists/me                  - Get my artist profile
 * GET  /api/artists/                    - Get all artists
 * GET  /api/artists/:username           - Get artist by username
 * PUT  /api/artists/update              - Update artist profile
 * PUT  /api/artists/update-image        - Update artist profile image
 */