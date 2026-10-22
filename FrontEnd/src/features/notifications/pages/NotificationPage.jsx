import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../discover/styles/Discover.css";
import "../../../shared/styles/Workspace.css";
import { authHeaders, getApiUrl } from "../../../shared/services/api";
import useRequireAuth from "../../../shared/hooks/useRequireAuth";

export default function Notification() {
    useRequireAuth();

    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const response = await axios.get(
                    getApiUrl("api/notifications"),
                    { headers: authHeaders() }
                );

                if (!cancelled) {
                    setNotes(response.data?.notifications || []);
                    setError("");
                }
            } catch (fetchError) {
                if (!cancelled) {
                    setNotes([]);
                    setError(
                        fetchError.response?.data?.message ||
                        "Could not load notifications."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const markRead = async (id) => {
        try {
            await axios.patch(
                getApiUrl(`api/notifications/${id}/read`),
                {},
                { headers: authHeaders() }
            );

            setNotes((previous) =>
                previous.map((item) =>
                    String(item._id) === String(id)
                        ? { ...item, read: true }
                        : item
                )
            );

            // Tell the navigation badge to refresh its count.
            window.dispatchEvent(
                new Event("notifications:updated")
            );

            return true;
        } catch (readError) {
            console.error(
                "Could not mark notification as read:",
                readError.response?.data || readError.message
            );

            return false;
        }
    };

    const handleNotificationClick = async (event, item) => {
        event.preventDefault();

        if (!item.read) {
            // Wait for PATCH to finish before changing the route.
            await markRead(item._id);
        }

        navigate(item.href || "/booking");
    };

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

            {error && <p className="workspace-banner">{error}</p>}

            {loading ? (
                <p>Loading notifications…</p>
            ) : notes.length === 0 ? (
                <section className="page-empty">
                    <h2>You're all caught up</h2>
                    <p>
                        Booking requests, accept/decline updates, and payment confirmations will show up here.
                    </p>
                    <Link to="/artists">Discover artists</Link>
                </section>
            ) : (
                <div className="note-list">
                    {notes.map((item) => (
                        <Link
                            className={`note-card ${item.read ? "" : "note-card-unread"}`}
                            key={item._id}
                            to={item.href || "/booking"}
                            onClick={(event) =>
                                handleNotificationClick(event, item)
                            }
                        >
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>

                            {item.createdAt && (
                                <span>
                                    {new Date(item.createdAt).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
