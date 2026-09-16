import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiMapPin,
} from "react-icons/fi";

import artists from "../data/artists.json";
import "../styles/pages/Booking.css";

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

    const requestedArtist = artists.find(
        (item) => String(item.id) === searchParams.get("artist")
    );

    const [selectedArtist, setSelectedArtist] = useState(
        requestedArtist?.id ?? artists[0]?.id ?? ""
    );

    const [submitted, setSubmitted] = useState(false);

    const artist = useMemo(
        () =>
            artists.find(
                (item) => String(item.id) === String(selectedArtist)
            ),
        [selectedArtist]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="booking-page">
            <header className="booking-page-header">
                <div>
                    <p className="booking-kicker">Bookings</p>

                    <h1>Bring your event to life.</h1>

                    <p className="booking-intro">
                        Tell us a little about your event and send a booking
                        request directly to an artist.
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

            <div className="booking-layout">
                <section
                    className="booking-form-card"
                    aria-labelledby="booking-form-title"
                >
                    <div className="booking-card-heading">
                        <span className="booking-step">01</span>

                        <div>
                            <h2 id="booking-form-title">
                                Request a booking
                            </h2>

                            <p>
                                We’ll share your details with the artist for
                                review.
                            </p>
                        </div>
                    </div>

                    {submitted && (
                        <div
                            className="booking-success"
                            role="status"
                        >
                            <FiCheckCircle aria-hidden="true" />
                            Your request is ready to send. The artist will
                            respond shortly.
                        </div>
                    )}

                    <form
                        className="booking-form"
                        onSubmit={handleSubmit}
                    >
                        <label>
                            Artist

                            <select
                                value={selectedArtist}
                                onChange={(event) => {
                                    setSelectedArtist(event.target.value);
                                    setSubmitted(false);
                                }}
                            >
                                {artists.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.stageName} · {item.category}
                                    </option>
                                ))}
                            </select>
                        </label>

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
                                    min="2026-09-15"
                                />
                            </label>
                        </div>

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

                        <label>
                            Tell the artist about your event

                            <textarea
                                required
                                rows="4"
                                placeholder="Share the occasion, performance duration, mood, and any details that will help them prepare."
                            />
                        </label>

                        <button
                            type="submit"
                            className="booking-submit"
                        >
                            Send booking request
                            <FiArrowRight aria-hidden="true" />
                        </button>
                    </form>
                </section>

                <aside className="booking-sidebar">
                    {artist && (
                        <section
                            className="artist-summary-card"
                            aria-label="Selected artist"
                        >
                            <div className="artist-summary-top">
                                <img
                                    src={artist.image}
                                    alt={artist.stageName}
                                />

                                <div>
                                    <p>Selected artist</p>

                                    <h2>{artist.stageName}</h2>

                                    <span>{artist.category}</span>
                                </div>
                            </div>

                            <div className="artist-summary-meta">
                                <span>
                                    <FiMapPin aria-hidden="true" />
                                    {artist.location}
                                </span>

                                <span>
                                    <FiCalendar aria-hidden="true" />
                                    Next available{" "}
                                    {new Date(
                                        artist.availability
                                    ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </span>
                            </div>

                            <div className="artist-summary-price">
                                <div>
                                    <small>Starting from</small>

                                    <strong>
                                        ₹
                                        {Number(
                                            artist.price
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                    <span>{artist.priceType}</span>
                                </div>

                                <span className="booking-rating">
                                    ★ {artist.rating} ({artist.reviews})
                                </span>
                            </div>
                        </section>
                    )}

                    <section className="booking-help-card">
                        <h3>What happens next?</h3>

                        <ol>
                            <li>
                                <span>1</span>
                                The artist reviews your event details.
                            </li>

                            <li>
                                <span>2</span>
                                Agree on availability and the final quote.
                            </li>

                            <li>
                                <span>3</span>
                                Confirm securely when you’re both ready.
                            </li>
                        </ol>
                    </section>
                </aside>
            </div>

        </main>
    );
}