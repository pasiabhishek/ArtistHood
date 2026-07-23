import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdVerified } from "react-icons/md";
import artists from "../../data/artists.json";
import "../../pages/css/FeaturedArtists.css";

export default function FeaturedArtist() {
    return (
        <section className="featured-section">
            <div className="home-section">
                <div className="section-heading">
                    <div className="">
                        <h2 className="font-bold text-3xl"> Featured artists.</h2>
                        <p>HANDPICKED TALENT</p>

                    </div>
                    <Link to="/artist">See all artists</Link>
                </div>
                <div className="artist-grid">
                    {artists.slice(0, 3).map((artist) => (
                        <article className="artist-card" key={artist.id}>
                            <img src={artist.image} alt={artist.name} />
                            <div className="artist-card-body">
                                <div className="artist-card-top">
                                    <span>{artist.category}</span>
                                    <span className="artist-rating">★ {artist.rating}</span>
                                </div>
                                <h3>
                                    {artist.name} {artist.verified && <MdVerified title="Verified artist" />}
                                </h3>
                                <p className="artist-location">
                                    <MdLocationOn /> {artist.location}
                                </p>
                                <div className="artist-card-footer">
                                    <div>
                                        <strong>₹{artist.price.toLocaleString("en-IN")}</strong>
                                        <small> / {artist.priceType}</small>
                                    </div>
                                    <Link to="/artist">View profile</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
