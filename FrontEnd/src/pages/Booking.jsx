import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiXCircle,
} from "react-icons/fi";
import axios from "axios";

import "../styles/pages/Booking.css";
import "../styles/pages/Workspace.css";
import {
    artistDisplayName,
    authHeaders,
    getApiUrl,
    getSessionToken,
    getSessionUser,
} from "../services/api";
import {
    bookingsForSession,
    patchLocalBooking,
} from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";

function formatDate(date) {
    if (!date) return "Date not specified";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Date not specified";
    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getUserName(user) {
    if (!user) return "Unknown";
    return (
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        "Unknown"
    );
}

function getStatusClass(status) {
    const value = String(status || "").toLowerCase();
    if (["approved", "accepted", "confirmed"].includes(value)) return "confirmed";
    if (["rejected", "cancelled"].includes(value)) return "rejected";
    return "pending";
}

export default function Booking() {
    useRequireAuth();

    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get("created");

    const [currentUser, setCurrentUser] = useState(getSessionUser());
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState("");
    const [success, setSuccess] = useState(
        highlightId ? "Booking request sent successfully." : ""
    );

    const isArtist = currentUser?.role === "Artist";

    useEffect(() => {
        setCurrentUser(getSessionUser());
    }, []);

    useEffect(() => {
        const token = getSessionToken();
        if (!currentUser || !token) {
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            const localList = bookingsForSession(currentUser);
            try {
                setLoading(true);
                const path = isArtist
                    ? "api/bookings/artist-bookings"
                    : "api/bookings/client-bookings";
                const response = await axios.get(getApiUrl(path), {
                    headers: authHeaders(),
                });
                const bookingList = Array.isArray(response.data?.bookings)
                    ? response.data.bookings
                    : [];
                const merged = [...bookingList];
                localList.forEach((item) => {
                    if (!merged.some((booking) => String(booking._id) === String(item._id))) {
                        merged.push(item);
                    }
                });
                setBookings(merged);
                setError("");
            } catch (fetchError) {
                console.error("Error fetching bookings:", fetchError.response?.data || fetchError.message);
                setBookings(localList);
                setError(
                    fetchError.response?.data?.message ||
                        "Using locally saved bookings because the live booking API is unavailable."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentUser, isArtist]);

    const updateStatus = async (bookingId, action) => {
        if (!bookingId) return;
        try {
            setActionLoading(bookingId);
            const response = await axios.put(
                getApiUrl(`api/bookings/${bookingId}/${action}`),
                {},
                { headers: authHeaders() }
            );
            const updatedBooking = response.data?.booking;
            setBookings((previous) =>
                previous.map((booking) =>
                    String(booking._id) === String(bookingId)
                        ? updatedBooking || {
                              ...booking,
                              status: action === "accept" ? "accepted" : "rejected",
                          }
                        : booking
                )
            );
            patchLocalBooking(bookingId, {
                status: action === "accept" ? "accepted" : "rejected",
            });
            setSuccess(
                action === "accept"
                    ? "Booking accepted."
                    : "Booking declined."
            );
        } catch (actionError) {
            if (String(bookingId).startsWith("local-")) {
                const status = action === "accept" ? "accepted" : "rejected";
                patchLocalBooking(bookingId, { status });
                setBookings((previous) =>
                    previous.map((booking) =>
                        String(booking._id) === String(bookingId)
                            ? { ...booking, status }
                            : booking
                    )
                );
                setSuccess(status === "accepted" ? "Booking accepted." : "Booking declined.");
            } else {
                alert(actionError.response?.data?.message || "Could not update this booking.");
            }
        } finally {
            setActionLoading("");
        }
    };

    const visibleBookings = useMemo(() => bookings, [bookings]);

    if (loading) {
        return (
            <main className="booking-page booking-page-loading">
                <p>Loading bookings...</p>
            </main>
        );
    }

    return (
        <main className="booking-page">
            <section className="booking-page-header">
                <div>
                    <p className="booking-kicker">
                        {isArtist ? "Artist dashboard" : "Your bookings"}
                    </p>
                    <h1>
                        {isArtist
                            ? "Received booking requests"
                            : "Your booking requests"}
                    </h1>
                    <p className="booking-intro">
                        {isArtist
                            ? "Review booking requests from clients and manage your events."
                            : "Track the booking requests you have sent to artists."}
                    </p>
                </div>
                {!isArtist && (
                    <Link to="/artists" className="booking-browse-link">
                        Browse artists
                        <FiArrowRight aria-hidden="true" />
                    </Link>
                )}
            </section>

            {success && (
                <div className="booking-success" role="status">
                    <FiCheckCircle aria-hidden="true" />
                    <span>{success}</span>
                </div>
            )}
            {error && <p className="workspace-banner">{error}</p>}

            <section className="booking-upcoming">
                <div className="upcoming-title">
                    <div>
                        <p className="booking-kicker">
                            {isArtist ? "Incoming" : "Sent requests"}
                        </p>
                        <h2>
                            {isArtist ? "Received requests" : "Your booking requests"}
                        </h2>
                    </div>
                    <span>
                        {visibleBookings.length}{" "}
                        {visibleBookings.length === 1 ? "request" : "requests"}
                    </span>
                </div>

                {visibleBookings.length === 0 ? (
                    <div className="booking-empty">
                        <FiCalendar />
                        <h3>No booking requests yet</h3>
                        <p>
                            {isArtist
                                ? "When clients send you booking requests, they will appear here."
                                : "You haven't sent any booking requests yet."}
                        </p>
                        {!isArtist && (
                            <Link to="/artists" className="booking-browse-link">
                                Find an artist
                                <FiArrowRight aria-hidden="true" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="upcoming-list">
                        {visibleBookings.map((booking) => {
                            const status = booking.status || "pending";
                            const isPending = String(status).toLowerCase() === "pending";
                            return (
                                <article className="upcoming-booking-card" key={booking._id}>
                                    <div className="upcoming-booking-details">
                                        <p className="booking-kicker">
                                            {isArtist ? "Client" : "Artist"}
                                        </p>
                                        <h3>
                                            {isArtist
                                                ? getUserName(booking.client)
                                                : artistDisplayName(booking.artist)}
                                        </h3>
                                        <p>{booking.eventType || "Event"}</p>
                                    </div>
                                    <span className={`booking-status ${getStatusClass(status)}`}>
                                        {status}
                                    </span>
                                    <p className="upcoming-booking-date">
                                        <FiCalendar aria-hidden="true" />
                                        {formatDate(booking.eventDate)}
                                    </p>
                                    <div className="booking-request-meta">
                                        <span>
                                            <FiClock aria-hidden="true" />
                                            {booking.startTime} - {booking.endTime}
                                        </span>
                                        <span>
                                            <FiMapPin aria-hidden="true" />
                                            {booking.location || "Venue in request"}
                                        </span>
                                        <span>
                                            ₹{Number(booking.price || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    {booking.description && (
                                        <p className="booking-description">{booking.description}</p>
                                    )}
                                    {isArtist && isPending && (
                                        <div className="booking-actions">
                                            <button
                                                type="button"
                                                className="booking-approve-button"
                                                disabled={actionLoading === booking._id}
                                                onClick={() => updateStatus(booking._id, "accept")}
                                            >
                                                <FiCheckCircle aria-hidden="true" />
                                                {actionLoading === booking._id ? "Processing..." : "Accept"}
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
                                    <div className="booking-actions">
                                        <Link className="booking-detail-link" to={`/booking/${booking._id}`}>
                                            View details
                                        </Link>
                                        <Link
                                            className="booking-detail-link"
                                            to={`/messages?user=${
                                                isArtist
                                                    ? booking.client?.username || booking.clientUsername || ""
                                                    : booking.artistUsername ||
                                                      booking.artist?.user?.username ||
                                                      ""
                                            }`}
                                        >
                                            Message
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
