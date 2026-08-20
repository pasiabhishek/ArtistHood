import React from "react";
import { Link } from "react-router-dom";
import "../../pages/css/Hero.css";

export default function Hero({ tagline, para }) {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <p className="hero-tagline">{tagline}</p>
                    <h1>
                        {/* Book the perfect <span>artist</span> for every moment. */}
                        Find an <span>artist</span> for your next event.
                    </h1>
                    <p className="hero-para">{para}</p>
                    <div className="hero-actions">
                        <Link className="hero-primary" to="/signup">
                            Explore artists
                        </Link>
                        <Link className="hero-secondary" to="/signup">
                            Join ArtistHood
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <strong>500+</strong> verified artists <i /> <strong>10K+</strong> successful bookings
                    </div>
                </div>
            </div>
        </section>
    );
}
