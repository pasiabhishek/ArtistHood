import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiMapPin,
} from "react-icons/fi";
import axios from "axios";

import "../styles/pages/Booking.css";
import "../styles/pages/Workspace.css";
import {
    artistDisplayName,
    artistUsernameOf,
    authHeaders,
    flattenArtistRecord,
    getApiUrl,
    getSessionToken,
    getSessionUser,
} from "../services/api";
import { upsertThread } from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";

const eventTypes = [
    "Wedding",
    "Private party",
    "Corporate event",
    "Festival",
    "Brand collaboration",
    "Other",
];

export default function BookingRequest() {
    useRequireAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentUser = getSessionUser();

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [formError, setFormError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        eventType: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        expectedGuests: "",
        description: "",
        price: "",
        location: "",
    });

    useEffect(() => {
        let cancelled = false;
        const fetchArtists = async () => {
            try {
                const response = await axios.get(getApiUrl("api/artists"));
                const list = Array.isArray(response.data?.artists)
                    ? response.data.artists.map(flattenArtistRecord)
                    : [];
                if (!cancelled) {
                    setArtists(list);
                    if (!list.length) {
                        setFormError("No artists are available to book yet.");
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    setArtists([]);
                    setFormError(
                        error.response?.data?.message ||
                            "Could not load artists. Please try again."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchArtists();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!artists.length) return;
        const usernameParam = searchParams.get("artist")?.trim().toLowerCase() || "";
        const requestedArtist = artists.find(
            (item) => artistUsernameOf(item).toLowerCase() === usernameParam
        );
        setSelectedArtist(String(requestedArtist?._id || requestedArtist?.id || artists[0]?._id || artists[0]?.id || ""));
        if (requestedArtist?.price) {
            setFormData((current) => ({
                ...current,
                price: current.price || String(requestedArtist.price),
            }));
        }
    }, [artists, searchParams]);

    const artist = useMemo(
        () =>
            artists.find(
                (item) => String(item._id || item.id) === String(selectedArtist)
            ),
        [artists, selectedArtist]
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
        setSubmitted(false);
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!getSessionToken() || !currentUser) {
            navigate("/login");
            return;
        }
        if (currentUser.role === "Artist") {
            setFormError("Artist accounts cannot send booking requests. Use a client account.");
            return;
        }
        if (!selectedArtist) {
            setFormError("Please select an artist.");
            return;
        }
        if (!formData.eventType || !formData.eventDate || !formData.startTime || !formData.endTime) {
            setFormError("Please complete the event date and time.");
            return;
        }
        if (formData.endTime <= formData.startTime) {
            setFormError("End time must be after start time.");
            return;
        }
        if (!formData.expectedGuests || Number(formData.expectedGuests) < 1) {
            setFormError("Please enter the expected number of guests.");
            return;
        }
        if (!formData.description.trim()) {
            setFormError("Please tell the artist about your event.");
            return;
        }
        if (!formData.location.trim()) {
            setFormError("Please add the venue or location.");
            return;
        }

        const bookingData = {
            artist: selectedArtist,
            eventDate: formData.eventDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            eventType: formData.eventType,
            expectedGuests: Number(formData.expectedGuests),
            description: formData.description.trim(),
            location: formData.location.trim(),
        };

        setIsSubmitting(true);
        setFormError("");

        try {
            const response = await axios.post(
                getApiUrl("api/bookings/create-booking"),
                bookingData,
                { headers: authHeaders({ "Content-Type": "application/json" }) }
            );
            const created = response.data?.booking;
            if (!created?._id) {
                setFormError("The server did not return a booking. Please try again.");
                return;
            }
            upsertThread({
                withUsername: artistUsernameOf(artist),
                withName: artistDisplayName(artist),
                messages: [
                    {
                        from: currentUser.username,
                        text: `Hi ${artistDisplayName(artist)}, I sent a booking request for ${formData.eventType} on ${formData.eventDate}.`,
                        at: new Date().toISOString(),
                    },
                ],
            });
            setSubmitted(true);
            navigate(`/booking/${created._id}?created=1`);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setFormError(
                error.response?.data?.message ||
                    "Could not send this booking request. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    if (loading) {
        return (
            <main className="booking-page booking-page-loading">
                <p>Loading artists…</p>
            </main>
        );
    }

    return (
        <main className="booking-page">
            <header className="booking-page-header">
                <div>
                    <p className="booking-kicker">Bookings</p>
                    <h1>Bring your event to life.</h1>
                    <p className="booking-intro">
                        Tell us a little about your event and send a booking request directly to an artist.
                    </p>
                </div>
                <Link to="/artists" className="booking-browse-link">
                    Browse artists
                    <FiArrowRight aria-hidden="true" />
                </Link>
            </header>

            <div className="booking-layout">
                <section className="booking-form-card">
                    <div className="booking-card-heading">
                        <span className="booking-step">01</span>
                        <div>
                            <h2>Request a booking</h2>
                            <p>We’ll share your details with the artist for review.</p>
                        </div>
                    </div>

                    {submitted && (
                        <div className="booking-success" role="status">
                            <FiCheckCircle aria-hidden="true" />
                            <span>Your booking request has been sent.</span>
                        </div>
                    )}
                    {formError && <p className="workspace-banner error">{formError}</p>}

                    {!artists.length ? (
                        <p className="workspace-banner">
                            No artists are available to book right now.
                        </p>
                    ) : (
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <label>
                            Artist
                            <select
                                value={selectedArtist}
                                onChange={(event) => setSelectedArtist(event.target.value)}
                                required
                            >
                                {artists.map((item) => (
                                    <option key={item._id || item.id} value={item._id || item.id}>
                                        {artistDisplayName(item)} · {item.category || "Artist"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="booking-form-row">
                            <label>
                                Event type
                                <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                                    <option value="" disabled>Select an event type</option>
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Event date
                                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} min={today} required />
                            </label>
                        </div>

                        <div className="booking-form-row">
                            <label>
                                Start time
                                <div className="booking-input-icon">
                                    <FiClock aria-hidden="true" />
                                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                                </div>
                            </label>
                            <label>
                                End time
                                <div className="booking-input-icon">
                                    <FiClock aria-hidden="true" />
                                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                                </div>
                            </label>
                        </div>

                        <div className="booking-form-row">
                            <label>
                                Expected guests
                                <input type="number" name="expectedGuests" value={formData.expectedGuests} onChange={handleChange} min="1" required placeholder="e.g. 150" />
                            </label>
                            <label>
                                Venue / location
                                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City or venue" required />
                            </label>
                        </div>

                        <label>
                            Tell the artist about your event
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                maxLength={2000}
                                rows="5"
                                placeholder="Share the occasion, performance duration, mood, venue details, and anything else that will help the artist prepare."
                            />
                        </label>

                        <button type="submit" className="booking-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending request..." : "Send booking request"}
                            {!isSubmitting && <FiArrowRight aria-hidden="true" />}
                        </button>
                    </form>
                    )}
                </section>

                <aside className="booking-sidebar">
                    {artist && (
                        <section className="artist-summary-card">
                            <div className="artist-summary-top">
                                <img src={artist.profileImage || "/favicon.ico"} alt={artistDisplayName(artist)} />
                                <div>
                                    <p>Selected artist</p>
                                    <h2>{artistDisplayName(artist)}</h2>
                                    <span>{artist.category || "Artist"}</span>
                                </div>
                            </div>
                            <div className="artist-summary-meta">
                                <span>
                                    <FiMapPin aria-hidden="true" />
                                    {[artist.city, artist.state].filter(Boolean).join(", ") || "Location not specified"}
                                </span>
                                {artist.availableFrom && (
                                    <span>
                                        <FiCalendar aria-hidden="true" />
                                        Available from{" "}
                                        {new Date(artist.availableFrom).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </span>
                                )}
                            </div>
                            {artist.price !== undefined && (
                                <div className="artist-summary-price">
                                    <div>
                                        <small>Starting from</small>
                                        <strong>₹{Number(artist.price).toLocaleString("en-IN")}</strong>
                                        <span>{artist.priceType || "per event"}</span>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                    <section className="booking-help-card">
                        <h3>What happens next?</h3>
                        <ol>
                            <li><span>1</span>The artist reviews your event details.</li>
                            <li><span>2</span>Agree on availability and the final quote.</li>
                            <li><span>3</span>Confirm securely when you’re both ready.</li>
                        </ol>
                    </section>
                </aside>
            </div>
        </main>
    );
}
