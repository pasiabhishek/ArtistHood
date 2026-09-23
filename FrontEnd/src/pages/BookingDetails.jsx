import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCheckCircle, FiClock, FiMapPin, FiXCircle } from "react-icons/fi";
import axios from "axios";

import "../styles/pages/Booking.css";
import "../styles/pages/Workspace.css";
import {
    artistDisplayName,
    artistUsernameOf,
    authHeaders,
    getApiUrl,
    getSessionUser,
} from "../services/api";
import { getLocalBookings, patchLocalBooking } from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";
import Loader from "../components/common/Loader";

function formatDate(date) {
    if (!date) return "Date not specified";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function BookingDetails() {
    useRequireAuth();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentUser = getSessionUser();
    const isArtist = currentUser?.role === "Artist";

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        searchParams.get("created") ? "Booking request sent successfully." : ""
    );
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadBooking = async () => {
            const local = getLocalBookings().find(
                (item) => String(item._id) === String(id)
            );
            try {
                if (String(id).startsWith("local-")) {
                    setBooking(local || null);
                    if (!local) setError("This local booking could not be found.");
                    return;
                }
                const response = await axios.get(getApiUrl(`api/bookings/${id}`), {
                    headers: authHeaders(),
                });
                setBooking(response.data?.booking || local || null);
            } catch (fetchError) {
                if (local) {
                    setBooking(local);
                    setError("Showing the locally saved booking.");
                } else {
                    setError(fetchError.response?.data?.message || "Booking not found.");
                }
            } finally {
                setLoading(false);
            }
        };
        loadBooking();
    }, [id]);

    const updateStatus = async (action) => {
        setActionLoading(true);
        try {
            const response = await axios.put(
                getApiUrl(`api/bookings/${id}/${action}`),
                {},
                { headers: authHeaders() }
            );
            setBooking(response.data?.booking || {
                ...booking,
                status: action === "accept" ? "accepted" : "rejected",
            });
            patchLocalBooking(id, {
                status: action === "accept" ? "accepted" : "rejected",
            });
            setSuccess(action === "accept" ? "Booking accepted." : "Booking declined.");
        } catch (actionError) {
            if (String(id).startsWith("local-") || booking) {
                const status = action === "accept" ? "accepted" : "rejected";
                patchLocalBooking(id, { status });
                setBooking({ ...booking, status });
                setSuccess(status === "accepted" ? "Booking accepted." : "Booking declined.");
            } else {
                setError(actionError.response?.data?.message || "Could not update this booking.");
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Loader />;

    if (!booking) {
        return (
            <section className="page-empty">
                <h1>Booking not found</h1>
                <p>{error || "This booking does not exist or you do not have access to it."}</p>
                <Link to="/booking">Back to bookings</Link>
            </section>
        );
    }

    const status = booking.status || "pending";
    const counterpartName = isArtist
        ? booking.client?.fullName || booking.client?.username || "Client"
        : artistDisplayName(booking.artist);
    const messageUser = isArtist
        ? booking.client?.username || booking.clientUsername
        : artistUsernameOf(booking.artist) || booking.artistUsername;

    return (
        <main className="booking-page">
            <section className="booking-page-header">
                <div>
                    <p className="booking-kicker">Booking details</p>
                    <h1>{booking.eventType || "Event booking"}</h1>
                    <p className="booking-intro">
                        {isArtist ? "Request from" : "Request to"} {counterpartName}
                    </p>
                </div>
                <Link to="/booking" className="booking-browse-link">
                    All bookings
                    <FiArrowRight aria-hidden="true" />
                </Link>
            </section>

            {success && (
                <div className="booking-success" role="status">
                    <FiCheckCircle aria-hidden="true" />
                    <span>{success}</span>
                </div>
            )}
            {error && <p className="workspace-banner">{error}</p>}

            <article className="booking-form-card">
                <span className={`booking-status ${String(status).toLowerCase() === "pending" ? "pending" : ["rejected", "cancelled"].includes(String(status).toLowerCase()) ? "rejected" : "confirmed"}`}>
                    {status}
                </span>
                <div className="booking-request-meta">
                    <span><FiCalendar aria-hidden="true" /> {formatDate(booking.eventDate)}</span>
                    <span><FiClock aria-hidden="true" /> {booking.startTime} - {booking.endTime}</span>
                    <span><FiMapPin aria-hidden="true" /> {booking.location || "Venue shared in the request"}</span>
                    <span>Guests: {booking.expectedGuests ?? 0}</span>
                    <span>₹{Number(booking.price || 0).toLocaleString("en-IN")}</span>
                </div>
                <p className="booking-description">{booking.description}</p>
                <div className="booking-actions">
                    {isArtist && String(status).toLowerCase() === "pending" && (
                        <>
                            <button type="button" className="booking-approve-button" disabled={actionLoading} onClick={() => updateStatus("accept")}>
                                <FiCheckCircle /> Accept
                            </button>
                            <button type="button" className="booking-reject-button" disabled={actionLoading} onClick={() => updateStatus("reject")}>
                                <FiXCircle /> Decline
                            </button>
                        </>
                    )}
                    <Link className="booking-detail-link" to={`/messages?user=${messageUser || ""}`}>
                        Open messages
                    </Link>
                    {!isArtist && (
                        <button type="button" className="booking-detail-link" onClick={() => navigate("/notifications")}>
                            Notifications
                        </button>
                    )}
                </div>
            </article>
        </main>
    );
}
