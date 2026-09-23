import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/common/Profile.css";
import "../styles/pages/Workspace.css";
import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import {
    artistDisplayName,
    artistUsernameOf,
    flattenArtistRecord,
    getApiUrl,
    getSessionUser,
} from "../services/api";
import localArtists from "../data/artists.json";

export default function Artists() {
    const { username } = useParams();
    const currentUser = getSessionUser();

    const [artist, setArtist] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState("");

    const isMyProfile =
        currentUser?.username &&
        username &&
        currentUser.username.toLowerCase() === username.toLowerCase();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [artistResponse, postsResponse] = await Promise.all([
                    axios.get(getApiUrl(`api/artists/${username}`)),
                    axios.get(getApiUrl("api/posts")).catch(() => ({ data: { posts: [] } })),
                ]);

                const record = flattenArtistRecord(
                    artistResponse.data?.artist || artistResponse.data
                );
                setArtist(record);
                setPosts(
                    Array.isArray(postsResponse.data?.posts)
                        ? postsResponse.data.posts
                        : []
                );
            } catch (fetchError) {
                console.error("Error fetching artist profile:", fetchError);
                const fallback = localArtists
                    .map(flattenArtistRecord)
                    .find(
                        (item) =>
                            artistUsernameOf(item).toLowerCase() ===
                            username?.toLowerCase()
                    );
                setArtist(fallback || null);
                setPosts([]);
                if (fallback) {
                    setError("Showing a saved demo profile because the live artist API is unavailable.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    const artistPosts = useMemo(() => {
        return posts.filter((post) => {
            const postUsername =
                post.artist?.username ||
                post.artist?.user?.username ||
                post.username;
            return (
                postUsername?.toLowerCase() === username?.toLowerCase()
            );
        });
    }, [posts, username]);

    if (loading) {
        return <Loader />;
    }

    if (!artist) {
        return (
            <main className="profile profile-not-found">
                <Header />
                <div className="profile-container">
                    <div className="profile-container-header2">
                        <h1>Artist not found</h1>
                        <p>We could not find an artist with that username.</p>
                        <Link to="/artists">Browse artists</Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const artistName = artistDisplayName(artist);
    const artistUsername = artistUsernameOf(artist) || username;
    const profileImage = artist.profileImage || "/favicon.ico";
    const mediaPosts = artistPosts.filter((post) => post.media);

    return (
        <div className="profile">
            <Header />
            <div className="profile-banner"></div>
            <div className="profile-container">
                {error && <p className="workspace-banner">{error}</p>}

                <div className="profile-container-header">
                    <div className="profile-container-header-left">
                        <img src={profileImage} alt={`${artistName} profile`} />
                    </div>

                    <div className="profile-container-header-right">
                        <div className="profile-container-header-right-name">
                            <h1>{artistName}</h1>
                        </div>

                        <div className="profile-meta-row">
                            <div className="profile-container-header-right-username">
                                @{artistUsername}
                            </div>
                            {(artist.city || artist.state) && (
                                <div className="profile-container-header-right-location">
                                    {artist.city}
                                    {artist.city && artist.state && ", "}
                                    {artist.state}
                                </div>
                            )}
                        </div>

                        {artist.category && (
                            <div className="profile-container-header-right-profession">
                                {artist.category}
                            </div>
                        )}

                        {artist.bio && (
                            <div className="profile-container-header-right-bio">
                                {artist.bio}
                            </div>
                        )}

                        <div className="profile-actions" aria-label={`Actions for ${artistName}`}>
                            <button
                                type="button"
                                disabled={isMyProfile}
                                style={{ opacity: isMyProfile ? "0.4" : "1" }}
                                className={`profile-follow-button ${isFollowing ? "is-following" : ""}`}
                                onClick={() => setIsFollowing((value) => !value)}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            <Link
                                className="profile-book-button"
                                to={
                                    isMyProfile
                                        ? "#"
                                        : `/booking-request?artist=${artistUsername}`
                                }
                                style={{
                                    opacity: isMyProfile ? "0.4" : "1",
                                    pointerEvents: isMyProfile ? "none" : "auto",
                                }}
                            >
                                Book now
                            </Link>
                            {!isMyProfile && (
                                <Link
                                    className="profile-follow-button"
                                    to={`/messages?user=${artistUsername}`}
                                >
                                    Message
                                </Link>
                            )}
                        </div>

                        <div className="profile-links" aria-label={`${artistName} links`}>
                            {artist.instagram && (
                                <a href={artist.instagram} target="_blank" rel="noreferrer">
                                    Instagram
                                </a>
                            )}
                            {artist.youtube && (
                                <a href={artist.youtube} target="_blank" rel="noreferrer">
                                    YouTube
                                </a>
                            )}
                            {artist.website && (
                                <a href={artist.website} target="_blank" rel="noreferrer">
                                    Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-container-header2">
                    <div className="followers">
                        <span>{artist.followers ?? artist.rating ?? 0}</span>
                        <span>Rating</span>
                    </div>
                    <div className="followers">
                        <span>{artist.experience ?? 0}</span>
                        <span>Years</span>
                    </div>
                    <div className="followers">
                        <span>₹{(artist.price || 0).toLocaleString("en-IN")}</span>
                        <span>{artist.priceType || "per event"}</span>
                    </div>
                </div>

                <section className="client-section">
                    <div className="client-section-heading">
                        <span className="section-eyebrow">PORTFOLIO</span>
                        <h2>Work by {artistName}</h2>
                    </div>
                    {mediaPosts.length > 0 ? (
                        <div className="portfolio-grid">
                            {mediaPosts.map((post) =>
                                post.mediaType === "video" ? (
                                    <video key={post._id} src={post.media} controls />
                                ) : (
                                    <img key={post._id} src={post.media} alt={post.caption || "Portfolio"} />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="profile-posts-empty">
                            <p>
                                {artist.bio ||
                                    `${artistName} is available for ${artist.category || "performances"} in ${[artist.city, artist.state].filter(Boolean).join(", ") || "your city"}.`}
                            </p>
                        </div>
                    )}
                </section>

                <section className="profile-posts" aria-labelledby="profile-posts-title">
                    <div className="profile-posts-header">
                        <h2 id="profile-posts-title">Posts by {artistName}</h2>
                    </div>
                    {artistPosts.length > 0 ? (
                        <div className="profile-post-list">
                            {artistPosts.map((post) => (
                                <article className="profile-post" key={post._id}>
                                    {post.caption && (
                                        <p className="profile-post-content">{post.caption}</p>
                                    )}
                                    {post.mediaType === "image" && post.media && (
                                        <img className="profile-post-media" src={post.media} alt={post.caption || "Post"} />
                                    )}
                                    {post.mediaType === "video" && post.media && (
                                        <video className="profile-post-media" controls preload="metadata">
                                            <source src={post.media} type="video/mp4" />
                                        </video>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-posts-empty">
                            <p>{artistName} hasn't posted anything yet.</p>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
}
