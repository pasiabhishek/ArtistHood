import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiInbox,
    FiMapPin,
    FiXCircle,
} from "react-icons/fi";

import "../../bookings/styles/Booking.css";
import "../../../shared/styles/Workspace.css";
import "../styles/Dashboard.css";
import {
    artistDisplayName,
    authHeaders,
    flattenArtistRecord,
    getApiUrl,
    getSessionUser,
} from "../../../shared/services/api";
import useRequireAuth from "../../../shared/hooks/useRequireAuth";
import Loader from "../../../shared/components/common/Loader";

function formatDashboardDate(value) {
    if (!value) return "Date not set";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date not set";

    return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function bookingStatusClass(status) {
    const normalized = String(status || "pending").toLowerCase();
    if (normalized === "pending") return "pending";
    if (["rejected", "cancelled"].includes(normalized)) return "rejected";
    return "confirmed";
}

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
            <section className="page-empty dashboard-access">
                <p className="discover-kicker">Dashboard</p>
                <h1>Artist dashboard</h1>
                <p>This space is for artist accounts. Your bookings still live in My Bookings.</p>
                <Link to="/booking">Open my bookings</Link>
            </section>
        );
    }

    return (
        <main className="booking-page dashboard-page">
            <section className="booking-page-header dashboard-header">
                <div className="dashboard-heading-copy">
                    <p className="booking-kicker">Artist dashboard</p>
                    <h1>{artistDisplayName(artist) || currentUser.fullName}</h1>
                    <p className="booking-intro">
                        A clear view of your booking activity, so you can focus on what’s next.
                    </p>
                </div>
                <Link to="/booking" className="booking-browse-link dashboard-all-requests">
                    <FiInbox aria-hidden="true" />
                    <span>All requests</span>
                </Link>
            </section>

            {error && (
                <p className="dashboard-banner" role="alert">
                    {error}
                </p>
            )}

            <div className="dashboard-stats">
                <div className="dashboard-stat dashboard-stat-total">
                    <span className="dashboard-stat-icon"><FiInbox aria-hidden="true" /></span>
                    <div>
                        <span className="dashboard-stat-label">Total requests</span>
                        <strong>{stats.total}</strong>
                    </div>
                </div>
                <div className="dashboard-stat dashboard-stat-pending">
                    <span className="dashboard-stat-icon"><FiClock aria-hidden="true" /></span>
                    <div>
                        <span className="dashboard-stat-label">Awaiting response</span>
                        <strong>{stats.pending}</strong>
                    </div>
                </div>
                <div className="dashboard-stat dashboard-stat-accepted">
                    <span className="dashboard-stat-icon"><FiCheckCircle aria-hidden="true" /></span>
                    <div>
                        <span className="dashboard-stat-label">Accepted bookings</span>
                        <strong>{stats.accepted}</strong>
                    </div>
                </div>
            </div>

            <section className="booking-upcoming dashboard-requests">
                <div className="upcoming-title dashboard-requests-heading">
                    <div>
                        <p className="dashboard-section-label">Your bookings</p>
                        <h2>Incoming requests</h2>
                    </div>
                    <span className="dashboard-request-count">
                        {bookings.length} {bookings.length === 1 ? "request" : "requests"}
                    </span>
                </div>
                {bookings.length === 0 ? (
                    <div className="booking-empty dashboard-empty">
                        <span className="dashboard-empty-icon">
                            <FiInbox aria-hidden="true" />
                        </span>
                        <h3>No requests yet</h3>
                        <p>
                            When a client sends a booking request, you’ll find it here to review and respond.
                        </p>
                    </div>
                ) : (
                    <div className="upcoming-list">
                        {bookings.map((booking) => {
                            const status = booking.status || "pending";
                            const isPending = String(status).toLowerCase() === "pending";
                            const clientName =
                                booking.client?.fullName ||
                                booking.client?.username ||
                                "Client";

                            return (
                                <article
                                    className="upcoming-booking-card dashboard-booking-card"
                                    key={booking._id}
                                >
                                    <span className="dashboard-client-avatar" aria-hidden="true">
                                        {clientName
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join("")
                                            .toUpperCase()}
                                    </span>
                                    <div className="upcoming-booking-details dashboard-booking-details">
                                        <p className="booking-kicker">
                                            {booking.eventType || "Booking request"}
                                        </p>
                                        <h3>{clientName}</h3>
                                        <span className={`booking-status ${bookingStatusClass(status)}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="dashboard-booking-meta">
                                        <span>
                                            <FiCalendar aria-hidden="true" />
                                            {formatDashboardDate(booking.eventDate)}
                                        </span>
                                        <span>
                                            <FiMapPin aria-hidden="true" />
                                            {booking.location || "Venue not provided"}
                                        </span>
                                        {booking.startTime && (
                                            <span>
                                                <FiClock aria-hidden="true" />
                                                {booking.startTime}
                                                {booking.endTime ? ` - ${booking.endTime}` : ""}
                                            </span>
                                        )}
                                    </div>
                                    <div className="dashboard-booking-actions">
                                        {isPending && (
                                            <div className="booking-actions">
                                                <button
                                                    type="button"
                                                    className="booking-approve-button"
                                                    disabled={actionLoading === booking._id}
                                                    onClick={() => updateStatus(booking._id, "accept")}
                                                >
                                                    <FiCheckCircle aria-hidden="true" />
                                                    {actionLoading === booking._id ? "Updating..." : "Accept"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="booking-reject-button"
                                                    disabled={actionLoading === booking._id}
                                                    onClick={() => updateStatus(booking._id, "reject")}
                                                >
                                                    <FiXCircle aria-hidden="true" />
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                        <Link
                                            className="booking-detail-link dashboard-detail-link"
                                            to={`/booking/${booking._id}`}
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
