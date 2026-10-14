import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../styles/post/Feed.css";
import useTitle from "../../hooks/useTitle";
import { authHeaders, getApiUrl } from "../../services/api";

import Loader from "../common/Loader";
import PostCard from "./PostCard";

export default function AfterLogin() {
    useTitle("Feed");

    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(getApiUrl("api/posts"), {
                    headers: authHeaders(),
                });
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
                        postsData.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                showActions
                                className="post-card-template--feed"
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
