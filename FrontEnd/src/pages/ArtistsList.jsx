import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdVerified } from "react-icons/md";
import artists from "../data/artists.json";
import "../styles/home/FeaturedArtists.css";
import Header from "../components/home/Header";


export default function ArtistsList() {
  return (
        <main className="artists-page">
            <Header />
            <section className="artists-page-heading" aria-labelledby="artists-page-title">
                <p>ARTISTHOOD DIRECTORY</p>
                <h1 id="artists-page-title">Find the right artist for your moment.</h1>
                <span>Browse performers, creators, and hosts ready to bring your next event to life.</span>
            </section>

            <section className="artist-grid artist-list-grid" aria-label="Artists">
                {artists.map((artist) => (
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
            </section>
        </main>
  )
}
