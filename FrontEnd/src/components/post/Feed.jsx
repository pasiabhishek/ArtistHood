import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../styles/post/Feed.css";
import useTitle from "../../hooks/useTitle";
import { getApiUrl } from "../../services/api";

import RightNav from "../layout/RightNav";
import Loader from "../common/Loader";

export default function AfterLogin() {
    useTitle("Feed");

    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(getApiUrl("api/posts"));
                const posts = Array.isArray(response.data?.posts)
                    ? response.data.posts
                    : [];
                setPostsData(posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPostsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="Feed">
                <div className="search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <input
                            type="search"
                            placeholder="Search artists, posts, or events"
                            aria-label="Search artists, posts, or events"
                        />
                    </form>
                </div>

                <Link to="/create-post" className="create-post-link">
                    <div className="Create_post">
                        <div className="first_row">
                            <img src="/favicon.ico" alt="" />
                            <p className="composer-prompt">Share something with the community...</p>
                        </div>
                        <div className="sec_row">
                            <div className="post_icon">
                                <i className="fa-regular fa-image"></i>
                                <i className="fa-solid fa-video"></i>
                            </div>
                            <button type="button">Post</button>
                        </div>
                    </div>
                </Link>

                <div className="posts">
                    {postsData.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts yet. Be the first to share a performance or update.</p>
                        </div>
                    ) : (
                        postsData.map((post) => {
                            const artist = post.artist;

                            return (
                                <article key={post._id} className="post-card">
                                    <div className="first_row">
                                        <Link
                                            to={artist?.username ? `/artists/${artist.username}` : "#"}
                                            className="post-profile-link"
                                        >
                                            <img
                                                src={artist?.profileImage || "/favicon.ico"}
                                                alt={artist?.username || "Artist"}
                                            />
                                        </Link>
                                        <div className="post-heading">
                                            {artist?.username ? (
                                                <Link
                                                    to={`/artists/${artist.username}`}
                                                    className="post-author-link"
                                                >
                                                    <h3>{artist.username}</h3>
                                                </Link>
                                            ) : (
                                                <h3>Unknown Artist</h3>
                                            )}
                                            <h5>Artist</h5>
                                        </div>
                                    </div>

                                    <Link to={`/posts/${post._id}`} className="create-post-link">
                                        <div className="sec_row">
                                            <p>{post.caption || ""}</p>
                                        </div>

                                        {post.mediaType === "image" && post.media && (
                                            <img
                                                className="post-media"
                                                src={post.media}
                                                alt={post.caption || "Post"}
                                            />
                                        )}

                                        {post.mediaType === "video" && post.media && (
                                            <video className="post-media" controls preload="metadata">
                                                <source src={post.media} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </Link>

                                    <div className="post-actions">
                                        <button type="button" className="post-action">
                                            <i className="fa-regular fa-heart"></i>
                                            <span>Like</span>
                                        </button>
                                        <button type="button" className="post-action">
                                            <i className="fa-regular fa-comment"></i>
                                            <span>Comment</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="post-action"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: "ArtistHood Post",
                                                        text: post.caption || "Check out this post",
                                                        url: window.location.origin + `/posts/${post._id}`,
                                                    });
                                                } else {
                                                    navigator.clipboard.writeText(
                                                        window.location.origin + `/posts/${post._id}`
                                                    );
                                                }
                                            }}
                                        >
                                            <i className="fa-solid fa-share"></i>
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>
            <RightNav />
        </div>
    );
}
