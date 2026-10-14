const Notification = require("../models/Notification");

const MAX_ATTEMPTS = 3;

const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

async function notify({ user, type, title, body, href, booking }) {
    if (!user) {
        console.error("Notification skipped: recipient user is missing.", {
            type,
            title,
        });
        return null;
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
            if (attempt < MAX_ATTEMPTS) {
                // Wait 300ms, then 600ms before retrying.
                await wait(attempt * 300);
                continue;
            }

            console.error("Notification creation failed after retries.", {
                type,
                title,
                attempt,
                error: error.message,
            });

            return null;
        }
    }

    return null;
}

module.exports = { notify };
