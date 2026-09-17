import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import postsData from "../data/postdata.json";
import "../styles/common/Profile.css";
import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import { getApiUrl } from "../services/api";


export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { username } = useParams();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(
          getApiUrl("api/artists")
        );

        setArtists(
          Array.isArray(response.data?.artists)
            ? response.data.artists
            : []
        );
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();

    if (user?.username == username) {
      setIsMyProfile(true)
    }
  }, []);

  // Find artist using the username from the User schema
  const artist = artists.find(
    (item) =>
      item.user?.username?.toLowerCase() ===
      username?.toLowerCase()
  );

  // Find posts using User username
  const artistPosts = postsData.filter(
    (post) =>
      post.artistUsername?.toLowerCase() ===
      artist?.user?.username?.toLowerCase()
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
    `${artist.user?.firstName || ""} ${artist.user?.lastName || ""
      }`.trim() ||
    "Artist";

  const artistUsername = artist.user?.username || "";

  const profileImage =
    artist?.profileImage;

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
              {/* Follow Button */}
              <button
                type="button"
                disabled={isMyProfile}
                style={{
                  opacity: isMyProfile?"0.4":"1"
                }}
                className={`profile-follow-button ${isFollowing ? "is-following" : ""}`}
                onClick={() => setIsFollowing((following) => !following)}
                aria-pressed={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>


              {/* Book */}
              <Link
                className="profile-book-button"disabled={isMyProfile}
                style={{
                  opacity: isMyProfile?"0.4":"1"
                }}
                to={`/booking-request?artist=${artist.user.username}`}
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