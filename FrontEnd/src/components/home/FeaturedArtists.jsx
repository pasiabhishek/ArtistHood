import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdVerified } from "react-icons/md";
import artists from "../../data/artists.json";
import "../../styles/home/FeaturedArtists.css";

export default function FeaturedArtist() {
    // The landing page highlights only a few artists to keep the section focused.
    return (
        <section className="featured-section">
            <div className="home-section">
                <div className="section-heading">
                    <div className="">
                        <h2 className="font-bold text-3xl"> Featured artists.</h2>
                        <p>HANDPICKED TALENT</p>

                    </div>
                    <Link to="/artists">See all artists</Link>
                </div>
                <div className="artist-grid">
                    {/* The home page shows a small preview; the artist page can grow later. */}
                    {artists.slice(0, 3).map((artist) => (
                        <article className="artist-card" key={artist.id}>
                            <div className="artist-card-image-wrap">
                                <img src={artist.image} alt={`${artist.name} profile`} />
                                {artist.verified && (
                                    <span className="artist-verified-badge" title="Verified artist">
                                        <MdVerified aria-hidden="true" /> Verified
                                    </span>
                                )}
                            </div>
                            <div className="artist-card-body">
                                <div className="artist-card-top">
                                    <span>{artist.category}</span>
                                    <span className="artist-rating" aria-label={`${artist.rating} out of 5 stars`}>
                                        ★ {artist.rating}
                                    </span>
                                </div>
                                <h2>{artist.name}</h2>
                                <p className="artist-location">
                                    <MdLocationOn aria-hidden="true" /> {artist.location}
                                </p>
                                <p className="artist-card-bio">{artist.bio}</p>
                                <div className="artist-card-footer">
                                    <div>
                                        <strong>₹{artist.price.toLocaleString("en-IN")}</strong>
                                        <small> / {artist.priceType}</small>
                                    </div>
                                    <Link to={`/artists/${artist.username}`}>View profile</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
