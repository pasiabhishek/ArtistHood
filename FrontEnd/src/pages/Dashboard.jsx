import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import "../styles/pages/Booking.css";
import "../styles/pages/Workspace.css";
import {
    artistDisplayName,
    authHeaders,
    flattenArtistRecord,
    getApiUrl,
    getSessionUser,
} from "../services/api";
import useRequireAuth from "../hooks/useRequireAuth";
import Loader from "../components/common/Loader";

export default function Dashboard() {
    useRequireAuth();
    const currentUser = getSessionUser();
    const [artist, setArtist] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [profileResponse, bookingsResponse] = await Promise.all([
                    axios.get(getApiUrl("api/artists/me"), { headers: authHeaders() }),
                    axios.get(getApiUrl("api/bookings/artist-bookings"), { headers: authHeaders() }),
                ]);
                setArtist(
                    flattenArtistRecord(
                        profileResponse.data?.artistProfile ||
                            profileResponse.data?.artist
                    )
                );
                setBookings(bookingsResponse.data?.bookings || []);
                setError("");
            } catch (fetchError) {
                setBookings([]);
                setError(
                    fetchError.response?.data?.message ||
                        "Could not load the artist dashboard."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentUser]);

    const stats = useMemo(() => {
        const pending = bookings.filter((item) => String(item.status).toLowerCase() === "pending").length;
        const accepted = bookings.filter((item) =>
            ["accepted", "approved", "confirmed"].includes(String(item.status).toLowerCase())
        ).length;
        return { total: bookings.length, pending, accepted };
    }, [bookings]);

    const updateStatus = async (bookingId, action) => {
        setActionLoading(bookingId);
        try {
            const response = await axios.put(
                getApiUrl(`api/bookings/${bookingId}/${action}`),
                {},
                { headers: authHeaders() }
            );
            const updated = response.data?.booking;
            const status = action === "accept" ? "accepted" : "rejected";
            setBookings((previous) =>
                previous.map((item) =>
                    String(item._id) === String(bookingId)
                        ? updated || { ...item, status }
                        : item
                )
            );
            setError("");
        } catch (actionError) {
            setError(actionError.response?.data?.message || "Could not update this booking.");
        } finally {
            setActionLoading("");
        }
    };

    if (loading) return <Loader />;

    if (currentUser?.role !== "Artist") {
        return (
            <section className="page-empty">
                <p className="discover-kicker">Dashboard</p>
                <h1>Artist dashboard</h1>
                <p>This space is for artist accounts. Your bookings still live in My Bookings.</p>
                <Link to="/booking">Open my bookings</Link>
            </section>
        );
    }

    return (
        <main className="booking-page">
            <section className="booking-page-header">
                <div>
                    <p className="booking-kicker">Artist dashboard</p>
                    <h1>{artistDisplayName(artist) || currentUser.fullName}</h1>
                    <p className="booking-intro">
                        Review incoming requests, keep track of confirmed shows, and jump into booking details.
                    </p>
                </div>
                <Link to="/booking" className="booking-browse-link">
                    All requests
                </Link>
            </section>

            {error && <p className="workspace-banner">{error}</p>}

            <div className="dashboard-stats">
                <div className="dashboard-stat">
                    <span>Requests</span>
                    <strong>{stats.total}</strong>
                </div>
                <div className="dashboard-stat">
                    <span>Pending</span>
                    <strong>{stats.pending}</strong>
                </div>
                <div className="dashboard-stat">
                    <span>Accepted</span>
                    <strong>{stats.accepted}</strong>
                </div>
            </div>

            <section className="booking-upcoming">
                <div className="upcoming-title">
                    <h2>Incoming requests</h2>
                </div>
                {bookings.length === 0 ? (
                    <div className="booking-empty">
                        <h3>No requests yet</h3>
                        <p>When a client books you, the request will land here for accept or decline.</p>
                    </div>
                ) : (
                    <div className="upcoming-list">
                        {bookings.map((booking) => (
                            <article className="upcoming-booking-card" key={booking._id}>
                                <div className="upcoming-booking-details">
                                    <p className="booking-kicker">{booking.eventType}</p>
                                    <h3>{booking.client?.fullName || booking.client?.username || "Client"}</h3>
                                    <p>{booking.status}</p>
                                </div>
                                {String(booking.status).toLowerCase() === "pending" && (
                                    <div className="booking-actions">
                                        <button
                                            type="button"
                                            className="booking-approve-button"
                                            disabled={actionLoading === booking._id}
                                            onClick={() => updateStatus(booking._id, "accept")}
                                        >
                                            <FiCheckCircle /> Accept
                                        </button>
                                        <button
                                            type="button"
                                            className="booking-reject-button"
                                            disabled={actionLoading === booking._id}
                                            onClick={() => updateStatus(booking._id, "reject")}
                                        >
                                            <FiXCircle /> Decline
                                        </button>
                                    </div>
                                )}
                                <Link className="booking-detail-link" to={`/booking/${booking._id}`}>
                                    Details
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
