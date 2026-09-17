const express = require('express');
const { createPost, getAllPosts } = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, upload.single('media'), createPost);
router.get('/', getAllPosts);

module.exports = router;