const express = require('express');
const router = express.Router();
const {
    getMyArtistProfile,
    getArtists,
    getArtistByUsername,
    updateArtistProfile,
    updateArtistProfileImage
} = require('../controllers/artistController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, getMyArtistProfile);      //fetch my artist profile
router.get('/', getArtists);                              //fetch all artists
router.get('/:username', getArtistByUsername);             //fetch artist by username
router.put('/update', protect, updateArtistProfile);      //update artist profile
router.put('/update-image',
    protect,
    upload.single('profileImage'),
    updateArtistProfileImage);      //update artist profile image


module.exports = router;