import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import { artistDisplayName, artistUsernameOf, flattenArtistRecord, getApiUrl } from "../services/api";
import Loader from "../components/common/Loader";
import localArtists from "../data/artists.json";

const categories = [
    "All",
    "Live music",
    "Wedding acts",
    "Event styling",
    "Creative reels",
    "Dance gigs",
    "Brand collabs",
];

function postUsername(post) {
    return (
        post.artist?.username ||
        post.artist?.user?.username ||
        post.username ||
        ""
    );
}

export default function Discover() {
    const [activeTag, setActiveTag] = useState("All");
    const [query, setQuery] = useState("");
    const [artists, setArtists] = useState([]);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDiscoverData = async () => {
            try {
                const [artistsResponse, postsResponse] = await Promise.all([
                    axios.get(getApiUrl("api/artists")),
                    axios.get(getApiUrl("api/posts")),
                ]);

                const artistsData = Array.isArray(artistsResponse.data?.artists)
                    ? artistsResponse.data.artists.map(flattenArtistRecord)
                    : [];
                const posts = Array.isArray(postsResponse.data?.posts)
                    ? postsResponse.data.posts
                    : [];

                setArtists(artistsData.length ? artistsData : localArtists.map(flattenArtistRecord));
                setPostsData(posts);
            } catch (fetchError) {
                console.error("Error fetching discover data:", fetchError);
                setArtists(localArtists.map(flattenArtistRecord));
                setPostsData([]);
                setError("Live feed is unavailable. Featured creators below still work for the demo.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscoverData();
    }, []);

    const filteredPosts = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return postsData.filter((post) => {
            const tags = Array.isArray(post.tags) ? post.tags : [];
            const caption = String(post.caption || "").toLowerCase();
            const username = postUsername(post).toLowerCase();
            const matchesTag =
                activeTag === "All" ||
                tags.some(
                    (tag) =>
                        tag.toLowerCase().includes(activeTag.toLowerCase()) ||
                        activeTag.toLowerCase().includes(tag.toLowerCase())
                ) ||
                caption.includes(activeTag.toLowerCase());
            const matchesQuery =
                !needle ||
                caption.includes(needle) ||
                username.includes(needle);
            return matchesTag && matchesQuery;
        });
    }, [activeTag, postsData, query]);

    const filteredArtists = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return artists.filter((artist) => {
            const name = artistDisplayName(artist).toLowerCase();
            const username = artistUsernameOf(artist).toLowerCase();
            const category = String(artist.category || "").toLowerCase();
            return (
                !needle ||
                name.includes(needle) ||
                username.includes(needle) ||
                category.includes(needle)
            );
        });
    }, [artists, query]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="discover-page">
            <header className="discover-header">
                <div>
                    <p className="discover-kicker">Discover</p>
                    <h1>Fresh talent and new inspiration</h1>
                </div>
                <Link to="/artists" className="primary-discover-btn">
                    Browse artists
                </Link>
            </header>

            <div className="workspace-search">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search posts and artists"
                    aria-label="Search discover"
                />
            </div>

            <div className="discover-toolbar">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`discover-tag ${activeTag === category ? "is-active" : ""}`}
                        onClick={() => setActiveTag(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {error && <p className="workspace-banner">{error}</p>}

            <div className="discover-layout">
                <main className="discover-feed">
                    {filteredPosts.length === 0 ? (
                        <div className="no-posts page-empty">
                            <h2>No stories yet</h2>
                            <p>
                                No posts match this filter. Browse artists and send a booking
                                request to get the community started.
                            </p>
                            <Link to="/artists">Find artists</Link>
                        </div>
                    ) : (
                        filteredPosts.map((post) => {
                            const username = postUsername(post);
                            const artist = flattenArtistRecord(post.artist) || post.artist;
                            return (
                                <article key={post._id} className="discover-post-card">
                                    <div className="first_row">
                                        <Link
                                            to={username ? `/artists/${username}` : "/artists"}
                                            className="post-profile-link"
                                        >
                                            <img
                                                src={artist?.profileImage || "/favicon.ico"}
                                                alt={username || "Artist"}
                                            />
                                        </Link>
                                        <div className="post-heading">
                                            {username ? (
                                                <Link to={`/artists/${username}`} className="post-author-link">
                                                    <h3>{artistDisplayName(artist) || username}</h3>
                                                </Link>
                                            ) : (
                                                <h3>Unknown Artist</h3>
                                            )}
                                            <h5>{artist?.category || "Artist"}</h5>
                                        </div>
                                    </div>
                                    <Link to={`/posts/${post._id}`} className="create-post-link">
                                        <div className="sec_row">
                                            <p>{post.caption || ""}</p>
                                        </div>
                                        {post.mediaType === "image" && post.media && (
                                            <img className="post-media" src={post.media} alt={post.caption || "Post"} />
                                        )}
                                        {post.mediaType === "video" && post.media && (
                                            <video className="post-media" controls preload="metadata">
                                                <source src={post.media} type="video/mp4" />
                                            </video>
                                        )}
                                    </Link>
                                </article>
                            );
                        })
                    )}
                </main>

                <aside className="discover-sidebar">
                    <div className="sidebar-panel">
                        <h3>Featured creators</h3>
                        {filteredArtists.slice(0, 6).map((artist) => {
                            const username = artistUsernameOf(artist);
                            return (
                                <div key={artist._id || username} className="creator-row">
                                    <Link to={username ? `/artists/${username}` : "/artists"}>
                                        <img
                                            src={artist.profileImage || "/favicon.ico"}
                                            alt={artistDisplayName(artist)}
                                        />
                                    </Link>
                                    <div>
                                        <Link to={username ? `/artists/${username}` : "/artists"}>
                                            <strong>{artistDisplayName(artist)}</strong>
                                        </Link>
                                        <span>{artist.category || "Artist"}</span>
                                    </div>
                                    <Link to={username ? `/artists/${username}` : "/artists"}>
                                        View
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    <div className="sidebar-panel">
                        <h3>Trending now</h3>
                        <ul className="trend-list">
                            <li>Wedding DJs</li>
                            <li>Live acoustic sets</li>
                            <li>Stage choreography</li>
                            <li>Performance reels</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
