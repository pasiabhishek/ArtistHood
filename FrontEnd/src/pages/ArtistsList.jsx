import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdLocationOn, MdVerified } from 'react-icons/md';
import '../styles/home/FeaturedArtists.css';
import Header from '../components/home/Header';
import Footer from '../components/layout/Footer';
import Loader from '../components/common/Loader';
import { getApiUrl } from '../services/api';



export default function ArtistsList() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(
                    getApiUrl("api/artists"),
                );
                setArtists(Array.isArray(response.data?.artists) ? response.data.artists : []);
            } catch (error) {
                console.error('Error fetching artists:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    if (loading) {
        return <Loader />;
    }

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
                    <article
                        className="artist-card"
                        key={artist._id || artist.id}
                    >
                        <div className="artist-card-image-wrap">
                            <img
                                src={
                                    artist.profileImage ||
                                    artist.user?.profileImage ||
                                    "/images/default-profile.png"
                                }
                                alt={`${artist.stageName || "Artist"} profile`}
                            />

                            {artist.verified && (
                                <span
                                    className="artist-verified-badge"
                                    title="Verified artist"
                                >
                                    <MdVerified aria-hidden="true" />
                                    Verified
                                </span>
                            )}
                        </div>

                        <div className="artist-card-body">
                            <div className="artist-card-top">
                                <span>{artist.category}</span>

                                <span
                                    className="artist-rating"
                                    aria-label={`${artist.rating || 0} out of 5 stars`}
                                >
                                    ★ {artist.rating || 0}
                                </span>
                            </div>

                            <h2>{artist.stageName}</h2>

                            <p className="artist-location">
                                <MdLocationOn aria-hidden="true" />
                                {artist.city}
                                {artist.city && artist.state ? ", " : ""}
                                {artist.state}
                            </p>

                            <p className="artist-card-bio">
                                {artist.bio}
                            </p>

                            <div className="artist-card-footer">
                                <div>
                                    <strong>
                                        ₹{(artist.price || 0).toLocaleString("en-IN")}
                                    </strong>

                                    <small>
                                        {" "}
                                        / {artist.priceType || "event"}
                                    </small>
                                </div>

                                {artist.user?.username && (
                                    <Link
                                        to={`/artists/${artist.user.username}`}
                                    >
                                        View profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <Footer />
        </main>
    );
}
