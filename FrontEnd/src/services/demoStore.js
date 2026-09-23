const BOOKINGS_KEY = "artisthood_bookings";
const MESSAGES_KEY = "artisthood_messages";
const NOTIFICATIONS_KEY = "artisthood_notifications";
const PROFILE_KEY = "artisthood_local_profiles";

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalBookings() {
    return read(BOOKINGS_KEY, []);
}

export function upsertLocalBooking(booking) {
    const next = [
        booking,
        ...getLocalBookings().filter(
            (item) => String(item._id) !== String(booking._id)
        ),
    ];
    write(BOOKINGS_KEY, next);
    return next;
}

export function patchLocalBooking(id, patch) {
    const next = getLocalBookings().map((item) =>
        String(item._id) === String(id) ? { ...item, ...patch } : item
    );
    write(BOOKINGS_KEY, next);
    return next;
}

export function bookingsForSession(user) {
    if (!user) return [];
    const username = String(user.username || "").toLowerCase();
    const userId = String(user.id || user._id || "");

    return getLocalBookings().filter((booking) => {
        const clientUsername = String(
            booking.clientUsername ||
                booking.client?.username ||
                ""
        ).toLowerCase();
        const artistUsername = String(
            booking.artistUsername ||
                booking.artist?.user?.username ||
                booking.artist?.username ||
                ""
        ).toLowerCase();
        const clientId = String(
            booking.clientId || booking.client?.id || booking.client?._id || ""
        );
        const artistUserId = String(booking.artistUserId || "");

        if (user.role === "Artist") {
            return artistUsername === username || artistUserId === userId;
        }

        return clientUsername === username || clientId === userId;
    });
}

export function getThreads() {
    return read(MESSAGES_KEY, []);
}

export function getThread(username) {
    const key = String(username || "").toLowerCase();
    return (
        getThreads().find(
            (thread) =>
                String(thread.withUsername || "").toLowerCase() === key
        ) || null
    );
}

export function upsertThread(thread) {
    const key = String(thread.withUsername || "").toLowerCase();
    const next = [
        { ...thread, withUsername: key },
        ...getThreads().filter(
            (item) =>
                String(item.withUsername || "").toLowerCase() !== key
        ),
    ];
    write(MESSAGES_KEY, next);
    return next;
}

export function addMessage(username, message) {
    const existing = getThread(username) || {
        withUsername: username,
        withName: username,
        messages: [],
    };
    const next = {
        ...existing,
        messages: [...(existing.messages || []), message],
        updatedAt: message.at,
    };
    upsertThread(next);
    return next;
}

export function getNotifications() {
    return read(NOTIFICATIONS_KEY, []);
}

export function addNotification(notification) {
    const next = [
        {
            id: notification.id || `note-${Date.now()}`,
            read: false,
            createdAt: new Date().toISOString(),
            ...notification,
        },
        ...getNotifications(),
    ].slice(0, 40);
    write(NOTIFICATIONS_KEY, next);
    return next;
}

export function markNotificationsRead() {
    const next = getNotifications().map((item) => ({ ...item, read: true }));
    write(NOTIFICATIONS_KEY, next);
    return next;
}

export function getLocalProfile(username) {
    const all = read(PROFILE_KEY, {});
    return all[String(username || "").toLowerCase()] || null;
}

export function saveLocalProfile(username, patch) {
    const key = String(username || "").toLowerCase();
    const all = read(PROFILE_KEY, {});
    all[key] = { ...(all[key] || {}), ...patch };
    write(PROFILE_KEY, all);
    return all[key];
}
