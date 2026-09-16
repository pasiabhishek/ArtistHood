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
import useRequireAuth from "../hooks/useRequireAuth";
const eventTypes = [
    "Wedding",
    "Private party",
    "Corporate event",
    "Festival",
    "Brand collaboration",
    "Other",
];

const upcomingBookings = [
    {
        artist: "Aarav Sharma",
        event: "Sangeet celebration",
        date: "18 Oct 2026",
        status: "Confirmed",
        image: artists[1]?.image,
    },
    {
        artist: "Riya Kapoor",
        event: "Product launch",
        date: "04 Nov 2026",
        status: "Awaiting response",
        image: artists[2]?.image,
    },
];

export default function Booking() {
    const [searchParams] = useSearchParams();
    // useRequireAuth();


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
            <section
                className="booking-upcoming"
                aria-labelledby="upcoming-bookings-title"
            >
                <div className="upcoming-title">
                    <div>
                        <p className="booking-kicker">Your plans</p>

                        <h2 id="upcoming-bookings-title">
                            Upcoming bookings
                        </h2>
                    </div>

                    <button type="button">View all</button>
                </div>

                <div className="upcoming-list">
                    {upcomingBookings.map((booking) => (
                        <article
                            className="upcoming-booking-card"
                            key={booking.artist}
                        >
                            <img src={booking.image} alt="" />

                            <div className="upcoming-booking-details">
                                <h3>{booking.artist}</h3>
                                <p>{booking.event}</p>
                            </div>

                            <span
                                className={`booking-status ${booking.status === "Confirmed"
                                        ? "confirmed"
                                        : "pending"
                                    }`}
                            >
                                {booking.status}
                            </span>

                            <p className="upcoming-booking-date">
                                <FiClock aria-hidden="true" />
                                {booking.date}
                            </p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}