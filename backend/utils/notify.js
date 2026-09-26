const Notification = require("../models/Notification");

async function notify({ user, type, title, body, href, booking }) {
    if (!user) return null;

    try {
        return await Notification.create({
            user,
            type,
            title,
            body: body || "",
            href: href || "",
            booking: booking || undefined,
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
}

module.exports = { notify };
