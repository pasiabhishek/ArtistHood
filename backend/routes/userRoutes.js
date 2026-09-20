const express = require("express");
const router = express.Router();

const {
    updateProfileImage
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.put(
    "/update-image",
    protect,
    upload.single("profileImage"),
    updateProfileImage
);

module.exports = router;
