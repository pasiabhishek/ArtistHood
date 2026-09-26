const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getNotifications,
    markNotificationRead,
} = require("../controllers/notificationController");

router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);

module.exports = router;
