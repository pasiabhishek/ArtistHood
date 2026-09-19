import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../styles/home/Hero.css";
import { getApiUrl } from "../../services/api";

export default function Hero({ tagline, para }) {
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

    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <p className="hero-tagline">{tagline}</p>

                    <h1>
                        Find an <span>artist</span> for your next event.
                    </h1>

                    <p className="hero-para">{para}</p>

                    <div className="hero-actions">
                        <Link className="hero-primary" to="/artists">
                            Explore artists
                        </Link>

                        <Link className="hero-secondary" to="/signup">
                            Join ArtistHood
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <strong>{artistCount}+</strong> verified artists
                        <i />
                        <strong>10K+</strong> successful bookings
                    </div>
                </div>
            </div>
        </section>
    );
}