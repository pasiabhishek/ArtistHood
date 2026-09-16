import React, { useEffect, useState } from "react";
import "../../styles/post/Feed.css";
import useTitle from "../../hooks/useTitle";
import { Link, useNavigate } from "react-router-dom";
import postsData from "../../data/postdata.json";
import { getApiUrl } from "../../services/api";
import axios from "axios";
import RightNav from "../layout/RightNav";

export default function AfterLogin() {
    useTitle("Feed");

    const navigate = useNavigate();

    const [signed, setSigned] = useState(true);
    const [posts, setPosts] = useState(postsData);

    // Logout
    function signOUT() {
        localStorage.clear();
        setSigned(false);
        alert("Signed out");
        navigate("/login");
    }

    // Fetch posts from API
    async function getPost() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setSigned(false);
                navigate("/login");
                return;
            }

            const response = await axios.get(
                getApiUrl("api/posts"),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Posts:", response.data);

            if (Array.isArray(response.data)) {
                setPosts(response.data);
            } else if (Array.isArray(response.data?.posts)) {
                setPosts(response.data.posts);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error(
                "Error fetching posts:",
                error.response?.data || error.message
            );

            // If token is invalid/expired
            if (error.response?.status === 401) {
                localStorage.clear();
                setSigned(false);
                navigate("/login");
            }
        }
    }

    // Check login and fetch posts
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setSigned(false);
            navigate("/login");
            return;
        }

        getPost();
    }, []);

    // Don't render feed when logged out
    if (!signed) {
        return null;
    }

    return (
        <div>
            <div className="Feed">

                {/* Search */}
                <div className="search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <i
                            className="fa-solid fa-magnifying-glass"
                            aria-hidden="true"
                        ></i>

                        <input
                            type="search"
                            placeholder="Search artists, posts, or events"
                            aria-label="Search artists, posts, or events"
                        />
                    </form>
                </div>

                {/* Logout */}
                <button
                    type="button"
                    onClick={signOUT}
                >
                    Sign Out
                </button>

                {/* Create Post */}
                <Link to="/create-post">
                    <div className="Create_post">

                        <div className="first_row">
                            <img
                                src="/favicon.ico"
                                alt="Profile picture"
                            />

                            <textarea
                                placeholder="Share something with the community..."
                                readOnly
                            />
                        </div>

                        <div className="sec_row">

                            <div className="post_icon">
                                <i className="fa-regular fa-image"></i>
                                <i className="fa-solid fa-video"></i>
                            </div>

                            <button type="button">
                                Post
                            </button>

                        </div>
                    </div>
                </Link>

                {/* Posts */}
                <div className="posts">

                    {posts.length === 0 ? (
                        <p>No posts available.</p>
                    ) : (
                        posts.map((post, index) => (

                            <div
                                key={
                                    post._id ||
                                    post.id ||
                                    index
                                }
                                className="post-card"
                            >

                                {/* Post Header */}
                                <div className="first_row">

                                    <img
                                        src={
                                            post.user?.profileImage ||
                                            "/favicon.ico"
                                        }
                                        alt="Profile picture"
                                    />

                                    <div className="post-heading">

                                        <h3 id="post-heading-h3">
                                            {post.user?.fullName ||
                                                post.user?.name ||
                                                "Unknown User"}
                                        </h3>

                                        <h5 id="post-heading-h5">
                                            {post.user?.role ||
                                                "Artist"}
                                        </h5>

                                    </div>
                                </div>

                                {/* Post Content */}
                                {post.content && (
                                    <div className="sec_row">
                                        <p>{post.content}</p>
                                    </div>
                                )}

                                {/* Image */}
                                {post.media?.type === "image" && (
                                    <img
                                        className="post-media"
                                        src={post.media.url}
                                        alt="Post media"
                                    />
                                )}

                                {/* Video */}
                                {post.media?.type === "video" && (
                                    <video
                                        className="post-media"
                                        controls
                                        preload="metadata"
                                    >
                                        <source
                                            src={post.media.url}
                                            type="video/mp4"
                                        />

                                        Your browser does not support
                                        the video tag.
                                    </video>
                                )}

                            </div>
                        ))
                    )}

                </div>
            </div>

            <RightNav />
        </div>
    );
}