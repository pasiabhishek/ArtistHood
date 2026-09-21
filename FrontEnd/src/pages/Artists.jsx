import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/common/Profile.css";
import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import { getApiUrl } from "../services/api";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const { username } = useParams();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsResponse, postsResponse] = await Promise.all([
          axios.get(getApiUrl("api/artists")),
          axios.get(getApiUrl("api/posts")),
        ]);

        const artistsList = Array.isArray(
          artistsResponse.data?.artists
        )
          ? artistsResponse.data.artists
          : [];

        const postsList = Array.isArray(
          postsResponse.data?.posts
        )
          ? postsResponse.data.posts
          : [];

        setArtists(artistsList);
        setPosts(postsList);

        if (
          user?.username &&
          username &&
          user.username.toLowerCase() === username.toLowerCase()
        ) {
          setIsMyProfile(true);
        }
      } catch (error) {
        console.error("Error fetching artist profile:", error);

        setArtists([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  /*
   * Find artist using username
   */
  const artist = artists.find(
    (item) =>
      item.user?.username?.toLowerCase() ===
      username?.toLowerCase()
  );

  /*
   * Get posts belonging to this artist
   *
   * API post structure:
   *
   * post.artist.username
   */
  const artistPosts = posts.filter(
    (post) =>
      post.artist?.username?.toLowerCase() ===
      username?.toLowerCase()
  );

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

            <p>
              We could not find an artist with that username.
            </p>

            <Link to="/artists">
              Browse artists
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const artistName =
    artist.stageName ||
    `${artist.user?.firstName || ""} ${
      artist.user?.lastName || ""
    }`.trim() ||
    "Artist";

  const artistUsername = artist.user?.username || "";

  const profileImage =
    artist?.profileImage || "/favicon.ico";

  return (
    <div className="profile">
      <Header />

      <div className="profile-banner"></div>

      <div className="profile-container">

        {/* ================= PROFILE HEADER ================= */}

        <div className="profile-container-header">

          {/* Profile Image */}
          <div className="profile-container-header-left">
            <img
              src={profileImage}
              alt={`${artistName} profile`}
            />
          </div>

          {/* Profile Details */}
          <div className="profile-container-header-right">

            {/* Name */}
            <div className="profile-container-header-right-name">
              <h1>{artistName}</h1>
            </div>

            {/* Username + Location */}
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

            {/* Profession */}
            {artist.category && (
              <div className="profile-container-header-right-profession">
                {artist.category}
              </div>
            )}

            {/* Bio */}
            {artist.bio && (
              <div className="profile-container-header-right-bio">
                {artist.bio}
              </div>
            )}

            {/* ================= ACTIONS ================= */}

            <div
              className="profile-actions"
              aria-label={`Actions for ${artistName}`}
            >

              {/* Follow */}
              <button
                type="button"
                disabled={isMyProfile}
                style={{
                  opacity: isMyProfile ? "0.4" : "1",
                }}
                className={`profile-follow-button ${
                  isFollowing ? "is-following" : ""
                }`}
                onClick={() =>
                  setIsFollowing(
                    (following) => !following
                  )
                }
                aria-pressed={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              {/* Book */}
              <Link
                className="profile-book-button"
                to={
                  isMyProfile
                    ? "#"
                    : `/booking-request?artist=${artistUsername}`
                }
                style={{
                  opacity: isMyProfile ? "0.4" : "1",
                  pointerEvents: isMyProfile
                    ? "none"
                    : "auto",
                }}
              >
                Book now
              </Link>

            </div>

            {/* ================= SOCIAL LINKS ================= */}

            <div
              className="profile-links"
              aria-label={`${artistName} links`}
            >

              {artist.instagram && (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              )}

              {artist.youtube && (
                <a
                  href={artist.youtube}
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
              )}

              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              )}

            </div>

          </div>
        </div>

        {/* ================= PROFILE STATS ================= */}

        <div className="profile-container-header2">

          <div className="followers">
            <span>
              {artist.followers ?? 0}
            </span>

            <span>Followers</span>
          </div>

          <div className="followers">
            <span>
              {artist.following ?? 0}
            </span>

            <span>Following</span>
          </div>

          <div className="followers">
            <span>
              {artist.bookings ?? 0}
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
              Posts by {artistName}
            </h2>
          </div>

          {artistPosts.length > 0 ? (

            <div className="profile-post-list">

              {artistPosts.map((post) => (

                <article
                  className="profile-post"
                  key={post._id}
                >

                  {/* Caption */}
                  {post.caption && (
                    <p className="profile-post-content">
                      {post.caption}
                    </p>
                  )}

                  {/* Image */}
                  {post.mediaType === "image" &&
                    post.media && (
                      <img
                        className="profile-post-media"
                        src={post.media}
                        alt={post.caption || "Post"}
                      />
                    )}

                  {/* Video */}
                  {post.mediaType === "video" &&
                    post.media && (
                      <video
                        className="profile-post-media"
                        controls
                        preload="metadata"
                      >
                        <source
                          src={post.media}
                          type="video/mp4"
                        />

                        Your browser does not support
                        the video tag.
                      </video>
                    )}

                  {/* Post Actions */}
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
                      <span>Comment</span>
                    </button>

                    <button
                      type="button"
                      className="post-action"
                      onClick={() => {
                        const postUrl =
                          window.location.origin +
                          `/posts/${post._id}`;

                        if (navigator.share) {
                          navigator.share({
                            title: "ArtistHood Post",
                            text:
                              post.caption ||
                              "Check out this post",
                            url: postUrl,
                          });
                        } else {
                          navigator.clipboard.writeText(
                            postUrl
                          );
                        }
                      }}
                    >
                      <i className="fa-solid fa-share"></i>
                      <span>Share</span>
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="profile-posts-empty">
              <p>
                {artistName} hasn't posted anything yet.
              </p>
            </div>

          )}

        </section>

      </div>

      <Footer />
    </div>
  );
}