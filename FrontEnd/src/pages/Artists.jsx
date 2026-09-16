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

  const { username } = useParams();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(getApiUrl("api/artists"));

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
  }, []);

  const artist = artists.find(
    (item) =>
      item.username?.toLowerCase() === username?.toLowerCase()
  );

  const artistPosts = postsData.filter(
    (post) =>
      post.artistUsername?.toLowerCase() ===
      artist?.username?.toLowerCase()
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

            <Link to="/artist">Browse artists</Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <div className="profile">
      <Header />

      <div className="profile-banner"></div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-container-header">
          <div className="profile-container-header-left">
            <img
              src={artist.profileImage}
              alt={`${artist.stageName || artist.name} profile`}
            />
          </div>

          <div className="profile-container-header-right">
            <div className="profile-container-header-right-name">
              <h1>{artist.stageName || artist.name}</h1>
            </div>

            <div className="profile-meta-row">
              <div className="profile-container-header-right-username">
                @{artist.username}
              </div>

              {(artist.city || artist.state) && (
                <div className="profile-container-header-right-location">
                  {artist.city}
                  {artist.city && artist.state ? ", " : ""}
                  {artist.state}
                </div>
              )}
            </div>

            <div className="profile-container-header-right-profession">
              {artist.category}
            </div>

            <div className="profile-container-header-right-bio">
              {artist.bio}
            </div>

            {/* Actions */}
            <div
              className="profile-actions"
              aria-label={`Actions for ${
                artist.stageName || artist.name
              }`}
            >
              <button
                type="button"
                className={`profile-follow-button ${
                  isFollowing ? "is-following" : ""
                }`}
                onClick={() =>
                  setIsFollowing((following) => !following)
                }
                aria-pressed={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <Link
                className="profile-book-button"
                to={`/booking?artist=${artist.id || artist._id}`}
              >
                Book now
              </Link>
            </div>

            {/* Social Links */}
            <div
              className="profile-links"
              aria-label={`${artist.stageName || artist.name} links`}
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

        {/* Profile Stats */}
        <div className="profile-container-header2">
          <div className="followers">
            <span>{artist.followers ?? 0}</span>
            <span>Followers</span>
          </div>

          <div className="followers">
            <span>{artist.following ?? 0}</span>
            <span>Following</span>
          </div>

          <div className="followers">
            <span>{artist.bookings ?? 0}</span>
            <span>Bookings</span>
          </div>
        </div>

        {/* Posts */}
        <section
          className="profile-posts"
          aria-labelledby="profile-posts-title"
        >
          <div className="profile-posts-header">
            <h2 id="profile-posts-title">
              Posts by {artist.stageName || artist.name}
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

                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Comments */}
                  {post.commentList?.length > 0 && (
                    <div
                      className="profile-post-comments"
                      aria-label="Post comments"
                    >
                      {post.commentList.map((comment, index) => (
                        <p
                          key={`${post.id}-${comment.username}-${index}`}
                        >
                          <strong>{comment.username}</strong>{" "}
                          {comment.text}
                        </p>
                      ))}

                      {post.comments !== undefined && (
                        <span>
                          View all {post.comments} comments
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