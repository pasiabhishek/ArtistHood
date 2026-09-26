import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import { authHeaders, getApiUrl } from "../services/api";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Notification() {
    useRequireAuth();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(getApiUrl("api/notifications"), {
                    headers: authHeaders(),
                });
                setNotes(response.data?.notifications || []);
                setError("");
            } catch (fetchError) {
                setNotes([]);
                setError(
                    fetchError.response?.data?.message ||
                        "Could not load notifications."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
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
                    String(item._id) === String(id) ? { ...item, read: true } : item
                )
            );
        } catch (readError) {
            console.error(readError.response?.data || readError.message);
        }
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
                            onClick={() => {
                                if (!item.read) markRead(item._id);
                            }}
                        >
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
