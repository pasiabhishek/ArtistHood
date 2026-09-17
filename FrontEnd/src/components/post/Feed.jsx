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
                const response = await axios.get(
                    getApiUrl("api/posts")
                );

                console.log("Posts API response:", response.data);

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
        return <h3>Loading...</h3>;
    }

    return (
        <div>
            <div className="Feed">

                {/* Search */}
                <div className="search">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                    >
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

                {/* Create Post */}
                <Link
                    to="/create-post"
                    className="create-post-link"
                >
                    <div className="Create_post">

                        <div className="first_row">
                            <img
                                src="/favicon.ico"
                                alt="Profile"
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

                    {postsData.length === 0 ? (
                        <div className="no-posts">
                            <p>No posts available.</p>
                        </div>
                    ) : (
                        postsData.map((post) => {

                            const user = post.user || {};
                            const media = post.media || {};

                            return (
                                <div
                                    key={post._id || post.id}
                                    className="post-card"
                                >

                                    {/* Post Header */}
                                    <div className="first_row">

                                        <img
                                            src={
                                                user.profileImage ||
                                                "/favicon.ico"
                                            }
                                            alt={
                                                user.fullName ||
                                                "Profile"
                                            }
                                        />

                                        <div className="post-heading">

                                            <h3 id="post-heading-h3">
                                                {user.fullName ||
                                                    "Unknown User"}
                                            </h3>

                                            <h5 id="post-heading-h5">
                                                {user.role ||
                                                    "Artist"}
                                            </h5>

                                        </div>

                                    </div>

                                    {/* Post Content */}
                                    <div className="sec_row">
                                        <p>
                                            {post.content || ""}
                                        </p>
                                    </div>

                                    {/* Image */}
                                    {media.type === "image" &&
                                        media.url && (
                                            <img
                                                className="post-media"
                                                src={media.url}
                                                alt="Post"
                                            />
                                        )}

                                    {/* Video */}
                                    {media.type === "video" &&
                                        media.url && (
                                            <video
                                                className="post-media"
                                                controls
                                                preload="metadata"
                                            >
                                                <source
                                                    src={media.url}
                                                    type="video/mp4"
                                                />

                                                Your browser does not
                                                support the video tag.
                                            </video>
                                        )}

                                </div>
                            );
                        })
                    )}

                </div>
            </div>

            <RightNav />
        </div>
    );
}