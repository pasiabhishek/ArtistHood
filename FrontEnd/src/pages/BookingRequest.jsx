import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiMapPin,
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
    const [searchParams] = useSearchParams();

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtist, setSelectedArtist] = useState("");
    const [submitted, setSubmitted] = useState(false);

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
                console.error("Error fetching artists:", error);

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

            return username.trim().toLowerCase() === usernameParam;
        });

        // If artist exists in URL, select that artist.
        // Otherwise select the first artist.
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
    // SUBMIT
    // ================================

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    // ================================
    // TODAY
    // ================================

    const today = new Date().toISOString().split("T")[0];

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
                        Tell us a little about your event and send a
                        booking request directly to an artist.
                    </p>
                </div>

                <Link
                    to="/artists"
                    className="booking-browse-link"
                >
                    Browse artists
                    <FiArrowRight aria-hidden="true" />
                </Link>

            </header>

            {/* ================================
                MAIN LAYOUT
            ================================= */}

            <div className="booking-layout">

                {/* ================================
                    BOOKING FORM
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
                                We’ll share your details with the artist
                                for review.
                            </p>
                        </div>

                    </div>

                    {/* SUCCESS MESSAGE */}

                    {submitted && (
                        <div
                            className="booking-success"
                            role="status"
                        >
                            <FiCheckCircle aria-hidden="true" />

                            <span>
                                Your request is ready to send.
                                The artist will respond shortly.
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

                        {/* ================================
                            ARTIST
                        ================================= */}

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
                                        item._id || item.id;

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
                                            {item.category || "Artist"}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>

                        {/* ================================
                            EVENT TYPE + DATE
                        ================================= */}

                        <div className="booking-form-row">

                            <label>
                                Event type

                                <select
                                    required
                                    defaultValue=""
                                >
                                    <option
                                        value=""
                                        disabled
                                    >
                                        Select an event type
                                    </option>

                                    {eventTypes.map((type) => (
                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Event date

                                <input
                                    type="date"
                                    required
                                    min={today}
                                />
                            </label>

                        </div>

                        {/* ================================
                            CITY + GUESTS
                        ================================= */}

                        <div className="booking-form-row">

                            <label>
                                City or venue

                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mumbai, Maharashtra"
                                />
                            </label>

                            <label>
                                Expected guests

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 150"
                                />
                            </label>

                        </div>

                        {/* ================================
                            EVENT DETAILS
                        ================================= */}

                        <label>
                            Tell the artist about your event

                            <textarea
                                required
                                rows="4"
                                placeholder="Share the occasion, performance duration, mood, and any details that will help them prepare."
                            />
                        </label>

                        {/* ================================
                            SUBMIT
                        ================================= */}

                        <button
                            type="submit"
                            className="booking-submit"
                        >
                            Send booking request

                            <FiArrowRight
                                aria-hidden="true"
                            />
                        </button>

                    </form>

                </section>

                {/* ================================
                    ARTIST SIDEBAR
                ================================= */}

                <aside className="booking-sidebar">

                    {artist && (
                        <section
                            className="artist-summary-card"
                            aria-label="Selected artist"
                        >

                            {/* ================================
                                ARTIST HEADER
                            ================================= */}

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

                            {/* ================================
                                ARTIST META
                            ================================= */}

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

                            {/* ================================
                                PRICE / RATING
                            ================================= */}

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
                                            ★ {artist.rating}{" "}
                                            ({artist.reviews || 0})
                                        </span>
                                    )}

                                </div>
                            )}

                        </section>
                    )}

                    {/* ================================
                        HELP CARD
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
