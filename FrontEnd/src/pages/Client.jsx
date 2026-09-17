import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import postsData from "../data/postdata.json";
import "../styles/common/Profile.css";

import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";

import { getApiUrl } from "../services/api";

export default function Client() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const { username } = useParams();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(
          getApiUrl("api/artists")
        );

        const userData = response.data?.user;

        // Make sure this is a Client
        if (userData?.role === "Client") {
          setClient(userData);
        } else {
          setClient(null);
        }

      } catch (error) {
        console.error("Error fetching client:", error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchClient();
    }

    if (
      user?.username?.toLowerCase() ===
      username?.toLowerCase()
    ) {
      setIsMyProfile(true);
    }
  }, [username]);

  // Find posts using username
  const clientPosts = postsData.filter(
    (post) =>
      post.username?.toLowerCase() ===
      client?.username?.toLowerCase()
  );

  if (loading) {
    return <Loader />;
  }

  if (!client) {
    return (
      <main className="profile profile-not-found">
        <Header />

        <div className="profile-container">
          <div className="profile-container-header2">
            <h1>Client not found</h1>

            <p>
              We could not find a client with that username.
            </p>

            <Link to="/clients">
              Browse clients
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const clientName = client.fullName || "Client";
  const clientUsername = client.username || "";

  return (
    <div className="profile">
      <Header />

      <div className="profile-banner"></div>

      <div className="profile-container">

        {/* ================= PROFILE HEADER ================= */}

        <div className="profile-container-header">

          {/* Profile Image */}
          <div className="profile-container-header-left">
            <div className="profile-default-image">
              {clientName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-container-header-right">

            {/* Name */}
            <div className="profile-container-header-right-name">
              <h1>{clientName}</h1>
            </div>

            {/* Username */}
            <div className="profile-meta-row">

              <div className="profile-container-header-right-username">
                @{clientUsername}
              </div>

            </div>

            {/* Role */}
            <div className="profile-container-header-right-profession">
              {client.role}
            </div>

            {/* Email */}
            {client.email && (
              <div className="profile-container-header-right-bio">
                {client.email}
              </div>
            )}

            {/* ================= ACTIONS ================= */}

            <div
              className="profile-actions"
              aria-label={`Actions for ${clientName}`}
            >

              {/* Follow */}
              <button
                type="button"
                disabled={isMyProfile}
                style={{
                  opacity: isMyProfile ? "0.4" : "1"
                }}
                className={`profile-follow-button ${isFollowing ? "is-following" : ""
                  }`}
                onClick={() =>
                  setIsFollowing(
                    (following) => !following
                  )
                }
                aria-pressed={isFollowing}
              >
                {isFollowing
                  ? "Following"
                  : "Follow"}
              </button>

              {/* Message */}
              {!isMyProfile && (
                <Link
                  className="profile-book-button"
                  to={`/messages?user=${client.username}`}
                >
                  Message
                </Link>
              )}

            </div>

          </div>
        </div>

        {/* ================= PROFILE STATS ================= */}

        <div className="profile-container-header2">

          <div className="followers">
            <span>
              {client.followers ?? 0}
            </span>

            <span>Followers</span>
          </div>

          <div className="followers">
            <span>
              {client.following ?? 0}
            </span>

            <span>Following</span>
          </div>

          <div className="followers">
            <span>
              {client.bookings ?? 0}
            </span>

            <span>Bookings</span>
          </div>

        </div>

        {/* ================= POSTS ================= */}

        <section
          className="profile-posts"
          aria-labelledby="profile-posts-title"
        >

          <div className="profile-posts-header">
            <h2 id="profile-posts-title">
              Posts by {clientName}
            </h2>
          </div>

          {clientPosts.length > 0 ? (

            <div className="profile-post-list">

              {clientPosts.map((post) => (

                <article
                  className="profile-post"
                  key={post.id}
                >

                  {/* Post Content */}
                  {post.content && (
                    <p className="profile-post-content">
                      {post.content}
                    </p>
                  )}

                  {/* Image */}
                  {post.media?.type === "image" && (
                    <img
                      className="profile-post-media"
                      src={post.media.url}
                      alt={post.media.alt || ""}
                    />
                  )}

                  {/* Video */}
                  {post.media?.type === "video" && (
                    <video
                      className="profile-post-media"
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

                  {/* Comments */}
                  {post.commentList?.length > 0 && (
                    <div
                      className="profile-post-comments"
                      aria-label="Post comments"
                    >

                      {post.commentList.map(
                        (comment, index) => (
                          <p
                            key={`${post.id}-${comment.username}-${index}`}
                          >
                            <strong>
                              {comment.username}
                            </strong>{" "}
                            {comment.text}
                          </p>
                        )
                      )}

                      {post.comments !== undefined && (
                        <span>
                          View all{" "}
                          {post.comments} comments
                        </span>
                      )}

                    </div>
                  )}

                </article>
              ))}

            </div>

          ) : (

            <div className="profile-posts-empty">
              <p>No posts yet.</p>
            </div>

          )}

        </section>

      </div>

      <Footer />
    </div>
  );
}