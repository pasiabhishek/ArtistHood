import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { MdLocationOn, MdVerified } from "react-icons/md";

import "../styles/home/FeaturedArtists.css";
import "../styles/pages/Workspace.css";
import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import {
    artistDisplayName,
    artistUsernameOf,
    flattenArtistRecord,
    getApiUrl,
} from "../services/api";
import localArtists from "../data/artists.json";
import artistCategories from "../data/artistCategories";

export default function ArtistsList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [category, setCategory] = useState(
        searchParams.get("category") || "All"
    );

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(getApiUrl("api/artists"));
                const list = Array.isArray(response.data?.artists)
                    ? response.data.artists.map(flattenArtistRecord)
                    : [];
                setArtists(list.length ? list : localArtists.map(flattenArtistRecord));
                setError(list.length ? "" : "Showing sample artists while the live directory is empty.");
            } catch (fetchError) {
                console.error("Error fetching artists:", fetchError);
                setArtists(localArtists.map(flattenArtistRecord));
                setError("Live directory is unavailable, so sample artists are shown for the demo.");
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return artists.filter((artist) => {
            const name = artistDisplayName(artist).toLowerCase();
            const username = artistUsernameOf(artist).toLowerCase();
            const city = `${artist.city || ""} ${artist.state || ""}`.toLowerCase();
            const matchesQuery =
                !needle ||
                name.includes(needle) ||
                username.includes(needle) ||
                (artist.category || "").toLowerCase().includes(needle) ||
                city.includes(needle);
            const matchesCategory =
                category === "All" || artist.category === category;
            return matchesQuery && matchesCategory;
        });
    }, [artists, query, category]);

    const updateQuery = (value) => {
        setQuery(value);
        const next = {};
        if (value) next.q = value;
        if (category !== "All") next.category = category;
        setSearchParams(next);
    };

    const updateCategory = (value) => {
        setCategory(value);
        const next = {};
        if (query) next.q = query;
        if (value !== "All") next.category = value;
        setSearchParams(next);
    };

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

            <div className="artists-filter-bar">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => updateQuery(event.target.value)}
                    placeholder="Search by name, city, or category"
                    aria-label="Search artists"
                />
                <select
                    value={category}
                    onChange={(event) => updateCategory(event.target.value)}
                    aria-label="Filter by category"
                >
                    <option value="All">All categories</option>
                    {artistCategories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="workspace-banner">{error}</p>}

            {filtered.length === 0 ? (
                <div className="artists-empty">
                    <h2>No artists match that search</h2>
                    <p>Try another name, city, or category.</p>
                </div>
            ) : (
                <section className="artist-grid artist-list-grid" aria-label="Artists">
                    {filtered.map((artist) => {
                        const username = artistUsernameOf(artist);
                        return (
                            <article className="artist-card" key={artist._id || artist.id || username}>
                                <div className="artist-card-image-wrap">
                                    <img
                                        src={
                                            artist.profileImage ||
                                            "/images/default-profile.png"
                                        }
                                        alt={`${artistDisplayName(artist)} profile`}
                                    />
                                    {artist.verified && (
                                        <span className="artist-verified-badge" title="Verified artist">
                                            <MdVerified aria-hidden="true" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <div className="artist-card-body">
                                    <div className="artist-card-top">
                                        <span>{artist.category || "Artist"}</span>
                                        <span className="artist-rating">
                                            ★ {artist.rating || 0}
                                        </span>
                                    </div>
                                    <h2>{artistDisplayName(artist)}</h2>
                                    <p className="artist-location">
                                        <MdLocationOn aria-hidden="true" />
                                        {artist.city}
                                        {artist.city && artist.state ? ", " : ""}
                                        {artist.state}
                                    </p>
                                    <p className="artist-card-bio">{artist.bio}</p>
                                    <div className="artist-card-footer">
                                        <div>
                                            <strong>
                                                ₹{(artist.price || 0).toLocaleString("en-IN")}
                                            </strong>
                                            <small> / {artist.priceType || "event"}</small>
                                        </div>
                                        {username && (
                                            <Link to={`/artists/${username}`}>View profile</Link>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}

            <Footer />
        </main>
    );
}
