import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getApiUrl } from "../services/api";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Booking() {
    useRequireAuth();

    const [currentUser, setCurrentUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");

    const [isArtist, setIsArtist] = useState(false);

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                setLoading(false);
                return;
            }

            const user = JSON.parse(storedUser);

            setCurrentUser(user);
        } catch (error) {
            console.error(
                "Error reading logged-in user:",
                error
            );

            setLoading(false);
        }
    }, []);

    // ==========================================
    // GET ARTIST STATUS
    //
    // Every artist is a User.
    // A User becomes an Artist if they have
    // an ArtistProfile.
    //
    // Otherwise the User is treated as Client.
    // ==========================================

    useEffect(() => {
        if (!currentUser) return;

        const checkArtistStatus = async () => {
            try {
                const token = currentUser.token;

                if (!token) {
                    setIsArtist(false);
                    return;
                }

                /*
                 * This endpoint should return the logged-in
                 * user's artist profile if one exists.
                 *
                 * Example:
                 *
                 * {
                 *     artist: {...}
                 * }
                 *
                 * or
                 *
                 * {
                 *     artist: null
                 * }
                 */

                const response = await axios.get(
                    getApiUrl("api/artists/me"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const artistProfile =
                    response.data?.artist ||
                    response.data?.artistProfile ||
                    null;

                setIsArtist(Boolean(artistProfile));
            } catch (error) {
                /*
                 * If the user does not have an ArtistProfile,
                 * they are simply treated as a Client.
                 *
                 * A 404 here is therefore not an error
                 * for the application.
                 */

                if (
                    error.response?.status !== 404
                ) {
                    console.error(
                        "Error checking artist profile:",
                        error.response?.data ||
                        error.message
                    );
                }

                setIsArtist(false);
            }
        };

        checkArtistStatus();
    }, [currentUser]);

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token = currentUser?.token;

    // ==========================================
    // FETCH BOOKINGS
    //
    // Backend decides which bookings belong to
    // the logged-in user.
    //
    // Artist:
    //     received requests
    //
    // Client:
    //     sent requests
    // ==========================================

    useEffect(() => {
        if (!currentUser || !token) {
            return;
        }

        const fetchBookings = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    getApiUrl("api/bookings"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const bookingList =
                    Array.isArray(
                        response.data?.bookings
                    )
                        ? response.data.bookings
                        : [];

                setBookings(bookingList);
            } catch (error) {
                console.error(
                    "Error fetching bookings:",
                    error.response?.data ||
                    error.message
                );

                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentUser, token]);

    // ==========================================
    // APPROVE BOOKING
    // ==========================================

    const handleApprove = async (bookingId) => {
        if (!token || !bookingId) return;

        try {
            setActionLoading(bookingId);

            const response = await axios.patch(
                getApiUrl(
                    `api/bookings/${bookingId}/approve`
                ),
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const updatedBooking =
                response.data?.booking;

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    String(booking._id) ===
                    String(bookingId)
                        ? updatedBooking || {
                              ...booking,
                              status: "Approved",
                          }
                        : booking
                )
            );
        } catch (error) {
            console.error(
                "Approve booking error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to approve booking."
            );
        } finally {
            setActionLoading("");
        }
    };

    // ==========================================
    // REJECT BOOKING
    // ==========================================

    const handleReject = async (bookingId) => {
        if (!token || !bookingId) return;

        try {
            setActionLoading(bookingId);

            const response = await axios.patch(
                getApiUrl(
                    `api/bookings/${bookingId}/reject`
                ),
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const updatedBooking =
                response.data?.booking;

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    String(booking._id) ===
                    String(bookingId)
                        ? updatedBooking || {
                              ...booking,
                              status: "Rejected",
                          }
                        : booking
                )
            );
        } catch (error) {
            console.error(
                "Reject booking error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to reject booking."
            );
        } finally {
            setActionLoading("");
        }
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "Date not specified";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date not specified";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ==========================================
    // GET USER NAME
    // ==========================================

    const getUserName = (user) => {
        if (!user) {
            return "Unknown";
        }

        return (
            user.fullName ||
            `${user.firstName || ""} ${
                user.lastName || ""
            }`.trim() ||
            user.username ||
            "Unknown"
        );
    };

    // ==========================================
    // GET ARTIST NAME
    // ==========================================

    const getArtistName = (artist) => {
        if (!artist) {
            return "Artist";
        }

        return (
            artist.stageName ||
            artist.user?.fullName ||
            artist.user?.username ||
            artist.fullName ||
            artist.username ||
            getUserName(artist.user) ||
            "Artist"
        );
    };

    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        const value = String(status || "")
            .toLowerCase();

        if (
            value === "approved" ||
            value === "confirmed"
        ) {
            return "confirmed";
        }

        if (
            value === "rejected" ||
            value === "cancelled"
        ) {
            return "rejected";
        }

        return "pending";
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="booking-page booking-page-loading">
                <p>Loading bookings...</p>
            </main>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <main className="booking-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <section className="booking-page-header">

                <div>

                    <p className="booking-kicker">
                        {isArtist
                            ? "Artist dashboard"
                            : "Your bookings"}
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
                    <Link
                        to="/artists"
                        className="booking-browse-link"
                    >
                        Browse artists

                        <FiArrowRight
                            aria-hidden="true"
                        />
                    </Link>
                )}

            </section>

            {/* =====================================
                ARTIST VIEW
            ====================================== */}

            {isArtist && (
                <section
                    className="booking-upcoming"
                    aria-labelledby="received-bookings-title"
                >

                    <div className="upcoming-title">

                        <div>

                            <p className="booking-kicker">
                                Incoming
                            </p>

                            <h2 id="received-bookings-title">
                                Received requests
                            </h2>

                        </div>

                        <span>
                            {bookings.length} request
                            {bookings.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    {bookings.length === 0 ? (
                        <div className="booking-empty">

                            <FiCalendar />

                            <h3>
                                No booking requests yet
                            </h3>

                            <p>
                                When clients send you
                                booking requests,
                                they will appear here.
                            </p>

                        </div>
                    ) : (
                        <div className="upcoming-list">

                            {bookings.map((booking) => {

                                const status =
                                    booking.status ||
                                    "Pending";

                                const isPending =
                                    String(status)
                                        .toLowerCase() ===
                                    "pending";

                                return (
                                    <article
                                        className="upcoming-booking-card"
                                        key={booking._id}
                                    >

                                        {/* CLIENT */}

                                        <div className="upcoming-booking-details">

                                            <p className="booking-kicker">
                                                Booking request
                                            </p>

                                            <h3>
                                                {getUserName(
                                                    booking.client
                                                )}
                                            </h3>

                                            <p>
                                                {booking.eventType ||
                                                    "Event"}
                                            </p>

                                        </div>

                                        {/* STATUS */}

                                        <span
                                            className={`booking-status ${getStatusClass(
                                                status
                                            )}`}
                                        >
                                            {status}
                                        </span>

                                        {/* DATE */}

                                        <p className="upcoming-booking-date">

                                            <FiCalendar
                                                aria-hidden="true"
                                            />

                                            {formatDate(
                                                booking.eventDate
                                            )}

                                        </p>

                                        {/* BOOKING META */}

                                        <div className="booking-request-meta">

                                            <span>

                                                <FiClock
                                                    aria-hidden="true"
                                                />

                                                {
                                                    booking.startTime
                                                }

                                                {" - "}

                                                {
                                                    booking.endTime
                                                }

                                            </span>

                                            <span>

                                                <FiMapPin
                                                    aria-hidden="true"
                                                />

                                                {booking.location ||
                                                    "Location not specified"}

                                            </span>

                                            <span>

                                                ₹
                                                {Number(
                                                    booking.price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </span>

                                        </div>

                                        {/* DESCRIPTION */}

                                        {booking.description && (
                                            <p className="booking-description">
                                                {
                                                    booking.description
                                                }
                                            </p>
                                        )}

                                        {/* APPROVE / REJECT */}

                                        {isPending && (
                                            <div className="booking-actions">

                                                <button
                                                    type="button"
                                                    className="booking-approve-button"
                                                    disabled={
                                                        actionLoading ===
                                                        booking._id
                                                    }
                                                    onClick={() =>
                                                        handleApprove(
                                                            booking._id
                                                        )
                                                    }
                                                >

                                                    <FiCheckCircle
                                                        aria-hidden="true"
                                                    />

                                                    {actionLoading ===
                                                    booking._id
                                                        ? "Processing..."
                                                        : "Approve"}

                                                </button>

                                                <button
                                                    type="button"
                                                    className="booking-reject-button"
                                                    disabled={
                                                        actionLoading ===
                                                        booking._id
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            booking._id
                                                        )
                                                    }
                                                >

                                                    <FiXCircle
                                                        aria-hidden="true"
                                                    />

                                                    Reject

                                                </button>

                                            </div>
                                        )}

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </section>
            )}

            {/* =====================================
                CLIENT VIEW
            ====================================== */}

            {!isArtist && (
                <section
                    className="booking-upcoming"
                    aria-labelledby="sent-bookings-title"
                >

                    <div className="upcoming-title">

                        <div>

                            <p className="booking-kicker">
                                Sent requests
                            </p>

                            <h2 id="sent-bookings-title">
                                Your booking requests
                            </h2>

                        </div>

                        <span>
                            {bookings.length} booking
                            {bookings.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                    {bookings.length === 0 ? (
                        <div className="booking-empty">

                            <FiCalendar />

                            <h3>
                                No booking requests
                            </h3>

                            <p>
                                You haven't sent any
                                booking requests yet.
                            </p>

                            <Link
                                to="/artists"
                                className="booking-browse-link"
                            >
                                Find an artist

                                <FiArrowRight
                                    aria-hidden="true"
                                />
                            </Link>

                        </div>
                    ) : (
                        <div className="upcoming-list">

                            {bookings.map((booking) => {

                                const artist =
                                    booking.artist;

                                const status =
                                    booking.status ||
                                    "Pending";

                                const normalizedStatus =
                                    String(status)
                                        .toLowerCase();

                                return (
                                    <article
                                        className="upcoming-booking-card"
                                        key={booking._id}
                                    >

                                        {/* ARTIST */}

                                        <div className="upcoming-booking-details">

                                            <p className="booking-kicker">
                                                Artist
                                            </p>

                                            <h3>
                                                {getArtistName(
                                                    artist
                                                )}
                                            </h3>

                                            <p>
                                                {artist?.category ||
                                                    booking.eventType ||
                                                    "Artist booking"}
                                            </p>

                                        </div>

                                        {/* STATUS */}

                                        <span
                                            className={`booking-status ${getStatusClass(
                                                status
                                            )}`}
                                        >
                                            {status}
                                        </span>

                                        {/* DATE */}

                                        <p className="upcoming-booking-date">

                                            <FiCalendar
                                                aria-hidden="true"
                                            />

                                            {formatDate(
                                                booking.eventDate
                                            )}

                                        </p>

                                        {/* BOOKING META */}

                                        <div className="booking-request-meta">

                                            <span>

                                                <FiClock
                                                    aria-hidden="true"
                                                />

                                                {
                                                    booking.startTime
                                                }

                                                {" - "}

                                                {
                                                    booking.endTime
                                                }

                                            </span>

                                            <span>
                                                Guests:{" "}
                                                {
                                                    booking.expectedGuests ??
                                                    0
                                                }
                                            </span>

                                            <span>

                                                ₹
                                                {Number(
                                                    booking.price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </span>

                                        </div>

                                        {/* DESCRIPTION */}

                                        {booking.description && (
                                            <p className="booking-description">
                                                {
                                                    booking.description
                                                }
                                            </p>
                                        )}

                                        {/* APPROVED */}

                                        {normalizedStatus ===
                                            "approved" && (
                                            <div className="booking-approved-message">

                                                <FiCheckCircle
                                                    aria-hidden="true"
                                                />

                                                <span>
                                                    Your booking
                                                    request has
                                                    been approved
                                                    by the artist.
                                                </span>

                                            </div>
                                        )}

                                        {/* REJECTED */}

                                        {normalizedStatus ===
                                            "rejected" && (
                                            <div className="booking-rejected-message">

                                                <FiXCircle
                                                    aria-hidden="true"
                                                />

                                                <span>
                                                    This booking
                                                    request was
                                                    rejected by
                                                    the artist.
                                                </span>

                                            </div>
                                        )}

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </section>
            )}

        </main>
    );
}
