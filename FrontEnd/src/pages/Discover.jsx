import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/pages/Discover.css";
import { getApiUrl } from "../services/api";
import Loader from "../components/common/Loader";

const categories = [
    "Live music",
    "Wedding acts",
    "Event styling",
    "Creative reels",
    "Dance gigs",
    "Brand collabs",
];

export default function Discover() {
    const [activeTag, setActiveTag] = useState("All");
    const [artists, setArtists] = useState([]);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscoverData = async () => {
            try {
                const [artistsResponse, postsResponse] =
                    await Promise.all([
                        axios.get(getApiUrl("api/artists")),
                        axios.get(getApiUrl("api/posts")),
                    ]);

                const artistsData = Array.isArray(
                    artistsResponse.data?.artists
                )
                    ? artistsResponse.data.artists
                    : [];

                const posts = Array.isArray(
                    postsResponse.data?.posts
                )
                    ? postsResponse.data.posts
                    : [];

                setArtists(artistsData);
                setPostsData(posts);
            } catch (error) {
                console.error(
                    "Error fetching discover data:",
                    error
                );

                setArtists([]);
                setPostsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscoverData();
    }, []);

    const filteredPosts = useMemo(() => {
        if (activeTag === "All") {
            return postsData;
        }

        return postsData.filter((post) => {
            const tags = Array.isArray(post.tags)
                ? post.tags
                : [];

            return tags.some(
                (tag) =>
                    tag
                        .toLowerCase()
                        .includes(activeTag.toLowerCase()) ||
                    activeTag
                        .toLowerCase()
                        .includes(tag.toLowerCase())
            );
        });
    }, [activeTag, postsData]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="discover-page">
            <header className="discover-header">
                <div>
                    <p className="discover-kicker">Discover</p>

                    <h1>
                        Fresh talent and new inspiration
                    </h1>
                </div>

                <button
                    type="button"
                    className="primary-discover-btn"
                >
                    Follow creators
                </button>
            </header>

            <div className="discover-toolbar">
                {["All", ...categories].map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`discover-tag ${
                            activeTag === category
                                ? "is-active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTag(category)
                        }
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="discover-layout">
                <main className="discover-feed">
                    {filteredPosts.length === 0 ? (
                        <div className="no-posts">
                            <p>
                                No stories match this filter
                                yet. Try another category.
                            </p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => {
                            const artist = post.artist;

                            return (
                                <article
                                    key={post._id}
                                    className="discover-post-card"
                                >
                                    {/* ARTIST */}
                                    <div className="first_row">
                                        <Link
                                            to={
                                                artist?.username
                                                    ? `/artists/${artist.username}`
                                                    : "#"
                                            }
                                            className="post-profile-link"
                                        >
                                            <img
                                                src={
                                                    artist?.profileImage ||
                                                    "/favicon.ico"
                                                }
                                                alt={
                                                    artist?.username ||
                                                    "Artist"
                                                }
                                            />
                                        </Link>

                                        <div className="post-heading">
                                            {artist?.username ? (
                                                <Link
                                                    to={`/artists/${artist.username}`}
                                                    className="post-author-link"
                                                >
                                                    <h3>
                                                        {
                                                            artist.username
                                                        }
                                                    </h3>
                                                </Link>
                                            ) : (
                                                <h3>
                                                    Unknown Artist
                                                </h3>
                                            )}

                                            <h5>Artist</h5>
                                        </div>
                                    </div>

                                    {/* POST */}
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="create-post-link"
                                    >
                                        <div className="sec_row">
                                            <p>
                                                {post.caption ||
                                                    ""}
                                            </p>
                                        </div>

                                        {post.mediaType ===
                                            "image" &&
                                            post.media && (
                                                <img
                                                    className="post-media"
                                                    src={
                                                        post.media
                                                    }
                                                    alt={
                                                        post.caption ||
                                                        "Post"
                                                    }
                                                />
                                            )}

                                        {post.mediaType ===
                                            "video" &&
                                            post.media && (
                                                <video
                                                    className="post-media"
                                                    controls
                                                    preload="metadata"
                                                >
                                                    <source
                                                        src={
                                                            post.media
                                                        }
                                                        type="video/mp4"
                                                    />

                                                    Your browser does
                                                    not support the
                                                    video tag.
                                                </video>
                                            )}

                                        {post.mediaType ===
                                            "audio" &&
                                            post.media && (
                                                <audio
                                                    controls
                                                    src={
                                                        post.media
                                                    }
                                                />
                                            )}
                                    </Link>

                                    {/* ACTIONS */}
                                    <div className="post-actions">
                                        <button
                                            type="button"
                                            className="post-action"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                            <span>Like</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="post-action"
                                        >
                                            <i className="fa-regular fa-comment"></i>
                                            <span>
                                                Comment
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className="post-action"
                                            onClick={() => {
                                                const url =
                                                    window.location
                                                        .origin +
                                                    `/posts/${post._id}`;

                                                if (
                                                    navigator.share
                                                ) {
                                                    navigator.share(
                                                        {
                                                            title:
                                                                "ArtistHood Post",
                                                            text:
                                                                post.caption ||
                                                                "Check out this post",
                                                            url,
                                                        }
                                                    );
                                                } else {
                                                    navigator.clipboard.writeText(
                                                        url
                                                    );
                                                }
                                            }}
                                        >
                                            <i className="fa-solid fa-share"></i>
                                            <span>
                                                Share
                                            </span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </main>

                {/* SIDEBAR */}
                <aside className="discover-sidebar">
                    <div className="sidebar-panel">
                        <h3>Featured creators</h3>

                        {artists
                            .slice(0, 4)
                            .map((artist) => (
                                <div
                                    key={artist._id}
                                    className="creator-row"
                                >
                                    <Link
                                        to={
                                            artist.username
                                                ? `/artists/${artist.username}`
                                                : "#"
                                        }
                                    >
                                        <img
                                            src={
                                                artist.profileImage ||
                                                "/favicon.ico"
                                            }
                                            alt={
                                                artist.username ||
                                                "Artist"
                                            }
                                        />
                                    </Link>

                                    <div>
                                        <Link
                                            to={
                                                artist.username
                                                    ? `/artists/${artist.username}`
                                                    : "#"
                                            }
                                        >
                                            <strong>
                                                {artist.username ||
                                                    artist.fullName ||
                                                    "Artist"}
                                            </strong>
                                        </Link>

                                        <span>
                                            Artist
                                        </span>
                                    </div>

                                    <button type="button">
                                        Follow
                                    </button>
                                </div>
                            ))}
                    </div>

                    <div className="sidebar-panel">
                        <h3>Trending now</h3>

                        <ul className="trend-list">
                            <li>Wedding DJs</li>
                            <li>
                                Live acoustic sets
                            </li>
                            <li>
                                Stage choreography
                            </li>
                            <li>
                                Performance reels
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}