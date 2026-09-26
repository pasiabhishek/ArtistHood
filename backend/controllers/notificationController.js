const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get notifications",
        });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.read = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Mark notification read error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};

module.exports = { getNotifications, markNotificationRead };
