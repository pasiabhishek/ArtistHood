import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiMapPin,
    FiClock,
} from "react-icons/fi";
import axios from "axios";

import "../styles/pages/Booking.css";
import { getApiUrl } from "../services/api";

const eventTypes = [
    "Wedding",
    "Private party",
    "Corporate event",
    "Festival",
    "Brand collaboration",
    "Other",
];

export default function BookingRequest() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedArtist, setSelectedArtist] = useState("");

    const [formData, setFormData] = useState({
        eventType: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        expectedGuests: "",
        description: "",
        price: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ================================
    // FETCH ARTISTS
    // ================================

    useEffect(() => {
        let cancelled = false;

        const fetchArtists = async () => {
            try {
                const response = await axios.get(
                    getApiUrl("api/artists")
                );

                const list = Array.isArray(response.data?.artists)
                    ? response.data.artists
                    : [];

                if (!cancelled) {
                    setArtists(list);
                }
            } catch (error) {
                console.error(
                    "Error fetching artists:",
                    error.response?.data || error.message
                );

                if (!cancelled) {
                    setArtists([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchArtists();

        return () => {
            cancelled = true;
        };
    }, []);

    // ================================
    // SELECT ARTIST FROM URL
    //
    // Example:
    // /booking-request?artist=pasisarita
    // ================================

    useEffect(() => {
        if (!artists.length) return;

        const usernameParam =
            searchParams.get("artist")?.trim().toLowerCase() || "";

        const requestedArtist = artists.find((item) => {
            const username =
                item.username ||
                item.user?.username ||
                "";

            return (
                username.trim().toLowerCase() ===
                usernameParam
            );
        });

        const artistId =
            requestedArtist?._id ||
            requestedArtist?.id ||
            artists[0]?._id ||
            artists[0]?.id ||
            "";

        setSelectedArtist(String(artistId));
    }, [artists, searchParams]);

    // ================================
    // GET SELECTED ARTIST
    // ================================

    const artist = useMemo(() => {
        return artists.find(
            (item) =>
                String(item._id || item.id) ===
                String(selectedArtist)
        );
    }, [artists, selectedArtist]);

    // ================================
    // HANDLE INPUT
    // ================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));

        setSubmitted(false);
    };

    // ================================
    // SUBMIT BOOKING
    // ================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // ================================
        // GET LOGGED-IN USER
        // ================================

        const currentUser = JSON.parse(
            localStorage.getItem("user")
        );

        if (!currentUser) {
            alert("User not found. Please login again.");
            return;
        }

        // ================================
        // GET TOKEN
        // ================================

        const token = currentUser.token;

        if (!token) {
            alert("No token provided. Please login again.");
            return;
        }

        // ================================
        // ARTIST VALIDATION
        // ================================

        if (!selectedArtist) {
            alert("Please select an artist.");
            return;
        }

        // ================================
        // FORM VALIDATION
        // ================================

        if (!formData.eventType) {
            alert("Please select an event type.");
            return;
        }

        if (!formData.eventDate) {
            alert("Please select an event date.");
            return;
        }

        if (!formData.startTime) {
            alert("Please select a start time.");
            return;
        }

        if (!formData.endTime) {
            alert("Please select an end time.");
            return;
        }

        if (formData.endTime <= formData.startTime) {
            alert("End time must be after start time.");
            return;
        }

        if (
            !formData.expectedGuests ||
            Number(formData.expectedGuests) < 1
        ) {
            alert("Please enter the expected number of guests.");
            return;
        }

        if (!formData.description.trim()) {
            alert("Please tell the artist about your event.");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            alert("Please enter your budget.");
            return;
        }

        // ================================
        // BOOKING PAYLOAD
        // ================================

        const bookingData = {
            artist: selectedArtist,

            eventDate: formData.eventDate,

            startTime: formData.startTime,

            endTime: formData.endTime,

            eventType: formData.eventType,

            expectedGuests: Number(
                formData.expectedGuests
            ),

            description:
                formData.description.trim(),

            price: Number(formData.price),
        };

        console.log(
            "Booking request:",
            bookingData
        );

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                getApiUrl(
                    "api/booking/create-booking"
                ),
                bookingData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                }
            );

            console.log(
                "Booking created:",
                response.data
            );

            setSubmitted(true);

            alert(
                "Booking request sent successfully!"
            );

            // ================================
            // GO TO BOOKINGS
            // ================================

            navigate("/booking");

        } catch (error) {
            console.error(
                "Create booking error:",
                error.response?.data ||
                error.message
            );

            if (
                error.response?.status === 401
            ) {
                alert(
                    "Authentication failed. Please login again."
                );
            } else {
                alert(
                    error.response?.data?.message ||
                    "Failed to send booking request. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ================================
    // TODAY
    // ================================

    const today = new Date()
        .toISOString()
        .split("T")[0];

    // ================================
    // LOADING
    // ================================

    if (loading) {
        return (
            <main className="booking-page booking-page-loading">
                <p>Loading artists…</p>
            </main>
        );
    }

    // ================================
    // PAGE
    // ================================

    return (
        <main className="booking-page">

            {/* ================================
                HEADER
            ================================= */}

            <header className="booking-page-header">

                <div>

                    <p className="booking-kicker">
                        Bookings
                    </p>

                    <h1>
                        Bring your event to life.
                    </h1>

                    <p className="booking-intro">
                        Tell us a little about your event
                        and send a booking request directly
                        to an artist.
                    </p>

                </div>

                <Link
                    to="/artists"
                    className="booking-browse-link"
                >
                    Browse artists
                    <FiArrowRight
                        aria-hidden="true"
                    />
                </Link>

            </header>

            {/* ================================
                MAIN LAYOUT
            ================================= */}

            <div className="booking-layout">

                {/* ================================
                    FORM
                ================================= */}

                <section
                    className="booking-form-card"
                    aria-labelledby="booking-form-title"
                >

                    <div className="booking-card-heading">

                        <span className="booking-step">
                            01
                        </span>

                        <div>

                            <h2 id="booking-form-title">
                                Request a booking
                            </h2>

                            <p>
                                We’ll share your details
                                with the artist for review.
                            </p>

                        </div>

                    </div>

                    {/* SUCCESS */}

                    {submitted && (
                        <div
                            className="booking-success"
                            role="status"
                        >

                            <FiCheckCircle
                                aria-hidden="true"
                            />

                            <span>
                                Your booking request
                                has been sent.
                            </span>

                        </div>
                    )}

                    {/* ================================
                        FORM
                    ================================= */}

                    <form
                        className="booking-form"
                        onSubmit={handleSubmit}
                    >

                        {/* ARTIST */}

                        <label>
                            Artist

                            <select
                                value={selectedArtist}
                                onChange={(event) => {
                                    setSelectedArtist(
                                        event.target.value
                                    );

                                    setSubmitted(false);
                                }}
                                required
                            >

                                {artists.map((item) => {

                                    const artistId =
                                        item._id ||
                                        item.id;

                                    const username =
                                        item.username ||
                                        item.user?.username ||
                                        "";

                                    const name =
                                        item.stageName ||
                                        item.user?.fullName ||
                                        `${item.user?.firstName || ""} ${
                                            item.user?.lastName || ""
                                        }`.trim() ||
                                        item.fullName ||
                                        username ||
                                        "Artist";

                                    return (
                                        <option
                                            key={artistId}
                                            value={artistId}
                                        >
                                            {name}
                                            {" · "}
                                            {item.category ||
                                                "Artist"}
                                        </option>
                                    );
                                })}

                            </select>

                        </label>

                        {/* EVENT TYPE + DATE */}

                        <div className="booking-form-row">

                            <label>
                                Event type

                                <select
                                    name="eventType"
                                    value={
                                        formData.eventType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option
                                        value=""
                                        disabled
                                    >
                                        Select an event type
                                    </option>

                                    {eventTypes.map(
                                        (type) => (
                                            <option
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </option>
                                        )
                                    )}

                                </select>

                            </label>

                            <label>
                                Event date

                                <input
                                    type="date"
                                    name="eventDate"
                                    value={
                                        formData.eventDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={today}
                                    required
                                />

                            </label>

                        </div>

                        {/* START + END TIME */}

                        <div className="booking-form-row">

                            <label>
                                <span>
                                    Start time
                                </span>

                                <div className="booking-input-icon">

                                    <FiClock
                                        aria-hidden="true"
                                    />

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={
                                            formData.startTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </label>

                            <label>
                                <span>
                                    End time
                                </span>

                                <div className="booking-input-icon">

                                    <FiClock
                                        aria-hidden="true"
                                    />

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={
                                            formData.endTime
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </label>

                        </div>

                        {/* GUESTS + PRICE */}

                        <div className="booking-form-row">

                            <label>
                                Expected guests

                                <input
                                    type="number"
                                    name="expectedGuests"
                                    value={
                                        formData.expectedGuests
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    required
                                    placeholder="e.g. 150"
                                />

                            </label>

                            <label>
                                Budget / price

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    required
                                    placeholder="e.g. 15000"
                                />

                            </label>

                        </div>

                        {/* DESCRIPTION */}

                        <label>
                            Tell the artist about your event

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                maxLength={2000}
                                rows="5"
                                placeholder="Share the occasion, performance duration, mood, venue details, and anything else that will help the artist prepare."
                            />

                        </label>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="booking-submit"
                            disabled={isSubmitting}
                        >

                            {isSubmitting
                                ? "Sending request..."
                                : "Send booking request"}

                            {!isSubmitting && (
                                <FiArrowRight
                                    aria-hidden="true"
                                />
                            )}

                        </button>

                    </form>

                </section>

                {/* ================================
                    SIDEBAR
                ================================= */}

                <aside className="booking-sidebar">

                    {artist && (
                        <section
                            className="artist-summary-card"
                            aria-label="Selected artist"
                        >

                            {/* ARTIST HEADER */}

                            <div className="artist-summary-top">

                                <img
                                    src={
                                        artist.profileImage ||
                                        artist.image ||
                                        artist.user?.profileImage ||
                                        artist.user?.image ||
                                        "/images/default-avatar.png"
                                    }
                                    alt={
                                        artist.stageName ||
                                        artist.user?.username ||
                                        artist.username ||
                                        "Artist"
                                    }
                                />

                                <div>

                                    <p>
                                        Selected artist
                                    </p>

                                    <h2>
                                        {artist.stageName ||
                                            artist.user?.fullName ||
                                            `${artist.user?.firstName || ""} ${
                                                artist.user?.lastName || ""
                                            }`.trim() ||
                                            artist.fullName ||
                                            artist.username ||
                                            artist.user?.username ||
                                            "Artist"}
                                    </h2>

                                    <span>
                                        {artist.category ||
                                            "Artist"}
                                    </span>

                                </div>

                            </div>

                            {/* ARTIST META */}

                            <div className="artist-summary-meta">

                                <span>

                                    <FiMapPin
                                        aria-hidden="true"
                                    />

                                    {artist.location ||
                                        [
                                            artist.city,
                                            artist.state,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") ||
                                        "Location not specified"}

                                </span>

                                {artist.availability && (
                                    <span>

                                        <FiCalendar
                                            aria-hidden="true"
                                        />

                                        Next available{" "}

                                        {new Date(
                                            artist.availability
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                            }
                                        )}

                                    </span>
                                )}

                            </div>

                            {/* PRICE / RATING */}

                            {(artist.price !== undefined ||
                                artist.rating !== undefined) && (

                                <div className="artist-summary-price">

                                    {artist.price !== undefined && (
                                        <div>

                                            <small>
                                                Starting from
                                            </small>

                                            <strong>
                                                ₹
                                                {Number(
                                                    artist.price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                            <span>
                                                {artist.priceType ||
                                                    "per event"}
                                            </span>

                                        </div>
                                    )}

                                    {artist.rating !== undefined && (
                                        <span className="booking-rating">
                                            ★{" "}
                                            {artist.rating}{" "}
                                            (
                                            {artist.reviews ||
                                                0}
                                            )
                                        </span>
                                    )}

                                </div>
                            )}

                        </section>
                    )}

                    {/* ================================
                        HELP
                    ================================= */}

                    <section className="booking-help-card">

                        <h3>
                            What happens next?
                        </h3>

                        <ol>

                            <li>
                                <span>1</span>

                                The artist reviews your
                                event details.
                            </li>

                            <li>
                                <span>2</span>

                                Agree on availability and
                                the final quote.
                            </li>

                            <li>
                                <span>3</span>

                                Confirm securely when you’re
                                both ready.
                            </li>

                        </ol>

                    </section>

                </aside>

            </div>

        </main>
    );
}
