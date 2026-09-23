import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import { getSessionUser } from "../services/api";
import {
    bookingsForSession,
    getNotifications,
    markNotificationsRead,
} from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Notification() {
    useRequireAuth();
    const currentUser = getSessionUser();
    const [notes, setNotes] = useState(getNotifications());

    useEffect(() => {
        setNotes(markNotificationsRead());
    }, []);

    const bookingNotes = useMemo(() => {
        return bookingsForSession(currentUser).map((booking) => ({
            id: `booking-${booking._id}`,
            title: `Booking ${booking.status || "pending"}`,
            body: `${booking.eventType || "Event"} on ${booking.eventDate || "a selected date"}`,
            href: `/booking/${booking._id}`,
            createdAt: booking.createdAt,
        }));
    }, [currentUser]);

    const items = [...notes, ...bookingNotes];

    return (
        <div className="discover-page">
            <header className="discover-header">
                <div>
                    <p className="discover-kicker">Activity</p>
                    <h1>Notifications</h1>
                </div>
                <Link to="/booking" className="primary-discover-btn">
                    My bookings
                </Link>
            </header>

            {items.length === 0 ? (
                <section className="page-empty">
                    <h2>You're all caught up</h2>
                    <p>
                        Follows, booking updates, and comments will show up here as soon as they start coming in.
                    </p>
                    <Link to="/artists">Discover artists</Link>
                </section>
            ) : (
                <div className="note-list">
                    {items.map((item) => (
                        <Link className="note-card" key={item.id} to={item.href || "/booking"}>
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
                            {item.createdAt && (
                                <span>{new Date(item.createdAt).toLocaleString("en-IN")}</span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
