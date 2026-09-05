import React from "react";
import "./css/Feed.css";
import CreatePost from "./CreatePost";
import useTitle from "./UseTitle";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import postsData from "../data/postdata.json";

export default function AfterLogin() {
    useTitle("Feed");

    return (
        <div className="Feed">
            <div className="search">
                <form action="#">
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

            <Link to="/create-post">
                <div className="Create_post">
                    <div className="first_row">
                        <img src="favicon2.png" alt="profile picture" />
                        <textarea
                            placeholder="Share something with the community..."
                        />
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
                {postsData.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="first_row">
                            <img
                                src={post.user.profileImage}
                                alt="profile picture"
                            />

                            <div className="post-heading">
                                <h3 id="post-heading-h3">
                                    {post.user.fullName}
                                </h3>

                                <h5 id="post-heading-h5">
                                    {post.user.role}
                                </h5>
                            </div>
                        </div>

                        <div className="sec_row">
                            <p>{post.content}</p>
                        </div>

                        {/* Show image or video depending on the post type */}
                        {post.media?.type === "image" && (
                            <img
                                className="post-media"
                                src={post.media.url}
                                alt="post"
                            />
                        )}

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
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
