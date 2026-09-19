import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    MdCalendarMonth,
    MdPayments,
    MdSentimentSatisfied,
    MdStarRate,
    MdSupportAgent,
    MdVerifiedUser,
} from "react-icons/md";

import "../../styles/home/HomeSections.css";
import { getApiUrl } from "../../services/api";

const features = [
    {
        title: "Verified artists",
        text: "Every artist is quality checked before joining our community.",
        Icon: MdVerifiedUser,
    },
    {
        title: "Secure bookings",
        text: "Simple, transparent bookings from first enquiry to final performance.",
        Icon: MdPayments,
    },
    {
        title: "Helpful support",
        text: "Our team is here to help you find the right fit for your event.",
        Icon: MdSupportAgent,
    },
];

export default function WhyAH() {
    const [artistCount, setArtistCount] = useState(0);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(
                    getApiUrl("api/artists")
                );

                const artists = Array.isArray(response.data?.artists)
                    ? response.data.artists
                    : [];

                setArtistCount(artists.length);
            } catch (error) {
                console.error("Error fetching artists:", error);
                setArtistCount(0);
            }
        };

        fetchArtists();
    }, []);

    const stats = [
        {
            value: `${artistCount}+`,
            label: "Artists",
            Icon: MdSentimentSatisfied,
        },
        {
            value: "10K+",
            label: "Bookings",
            Icon: MdCalendarMonth,
        },
        {
            value: "4.9★",
            label: "Average rating",
            Icon: MdStarRate,
        },
    ];

    return (
        <section className="why-section">
            <div className="home-section">
                <div className="section-heading why-heading">
                    <div>
                        <p>WHY ARTISTHOOD</p>
                        <h2>Booking made memorable.</h2>
                    </div>
                </div>

                <div className="feature-grid">
                    {features.map(({ title, text, Icon }) => (
                        <article key={title}>
                            <Icon />
                            <div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="stats-grid">
                    {stats.map(({ value, label, Icon }) => (
                        <div key={label}>
                            <Icon />
                            <strong>{value}</strong>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}