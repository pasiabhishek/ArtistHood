import React from "react";
import { Link, useParams } from "react-router-dom";
import artists from "../data/artists.json";
import "../styles/common/Profile.css";

export default function Profile() {
  const { username } = useParams();
  const artist = artists.find((item) => item.username === username?.toLowerCase());

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
          <h2>About this artist</h2>
          <p>{artist.experience} years of experience</p>
          <p>
            Starting at ₹{artist.price.toLocaleString("en-IN")} / {artist.priceType}
          </p>
          <p>Available from {artist.availability}</p>
          <p>★ {artist.rating} ({artist.reviews} reviews)</p>
        </div>

      </div>
    </div>
  );
}
