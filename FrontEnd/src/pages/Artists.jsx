import React from "react";
import { Link, useParams } from "react-router-dom";
import artists from "../data/artists.json";
import postsData from "../data/postdata.json";
import "../styles/common/Profile.css";

export default function Artists() {
  const { username } = useParams();
  const artist = artists.find((item) => item.username === username?.toLowerCase());
  const artistPosts = postsData.filter(
    (post) => post.artistUsername === artist?.username,
  );

  if (!artist) {
    return (
      <main className="profile profile-not-found">
        <div className="profile-container">
          <div className="profile-container-header2">
            <h1>Artist not found</h1>
            <p>We could not find an artist with that username.</p>
            <Link to="/artist">Browse artists</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="profile">
      <div className="profile-banner">
      </div>

      <div className="profile-container">
        <div className="profile-container-header">
          <div className="profile-container-header-left">
            <img src={artist.image} alt={`${artist.name} profile`} />
          </div>

          <div className="profile-container-header-right">
            <div className="profile-container-header-right-name">
              <h1>{artist.stageName}</h1>
            </div>
            <div className="profile-meta-row">
              <div className="profile-container-header-right-username">
                @{artist.username}
              </div>
              <div className="profile-container-header-right-location">
                {artist.city}, {artist.state}
              </div>
            </div>
            <div className="profile-container-header-right-profession">
              {artist.category}
            </div>
            <div className="profile-container-header-right-bio">
              {artist.bio}
            </div>
            <div className="profile-links" aria-label={`${artist.stageName} links`}>
              {artist.instagram && (
                <a href={artist.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {artist.youtube && (
                <a href={artist.youtube} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              )}
              {artist.website && (
                <a href={artist.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="profile-container-header2">
          <div className="followers ">
            <span>{artist.followers}</span>
            <span>Followers</span>
          </div>
           <div className="followers ">
            <span>{artist.following}</span>
            <span>Followings</span>
          </div>
           <div className="followers ">
            <span>{artist.bookings}</span>
            <span>Bookings</span>
          </div>
        </div>

        <section className="profile-posts" aria-labelledby="profile-posts-title">
          <div className="profile-posts-header">
            <h2 id="profile-posts-title">Posts by {artist.stageName}</h2>
          </div>
          {artistPosts.length > 0 ? (
            <div className="profile-post-list">
              {artistPosts.map((post) => (
                <article className="profile-post" key={post.id}>
                  <div className="profile-post-author">
                    <img src={artist.image} alt="" />
                    <div>
                      <strong>{artist.stageName}</strong>
                      <span>{artist.category}</span>
                    </div>
                  </div>
                  <p className="profile-post-content">{post.content}</p>
                  {post.media?.type === "image" && (
                    <img className="profile-post-media" src={post.media.url} alt="" />
                  )}
                  {post.media?.type === "video" && (
                    <video className="profile-post-media" controls preload="metadata">
                      <source src={post.media.url} type="video/mp4" />
                    </video>
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
    </div>
  );
}