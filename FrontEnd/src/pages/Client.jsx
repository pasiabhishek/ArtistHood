import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/common/Profile.css";
import "../styles/pages/Workspace.css";

import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";

import {
    authHeaders,
    getApiUrl,
    getSessionUser,
} from "../services/api";
import { bookingsForSession, getLocalProfile } from "../services/demoStore";

export default function Client() {
    const { username } = useParams();
    const navigate = useNavigate();
    const currentUser = getSessionUser();

    const [client, setClient] = useState(null);
    const [posts, setPosts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState("");

    const isMyProfile =
        currentUser?.username?.toLowerCase() === username?.toLowerCase();

    useEffect(() => {
        if (!username && currentUser?.username) {
            navigate(`/client/${currentUser.username}`, { replace: true });
        }
    }, [username, currentUser, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const extras = getLocalProfile(username) || {};

            try {
                if (isMyProfile && currentUser) {
                    try {
                        const me = await axios.get(getApiUrl("api/auth/me"), {
                            headers: authHeaders(),
                        });
                        setClient({
                            ...(me.data?.user || currentUser),
                            ...extras,
                        });
                    } catch {
                        setClient({ ...currentUser, ...extras });
                    }
                } else {
                    setClient({
                        username,
                        fullName: extras.fullName || username,
                        bio: extras.bio,
                        location: extras.location,
                        role: "Client",
                    });
                    setError("Public client profiles are limited until a user lookup API is added.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, isMyProfile, currentUser]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const response = await axios.get(getApiUrl("api/posts"));
                setPosts(response.data?.posts || []);
            } catch {
                setPosts([]);
            }

            if (isMyProfile) {
                try {
                    const response = await axios.get(
                        getApiUrl("api/bookings/client-bookings"),
                        { headers: authHeaders() }
                    );
                    setBookings(response.data?.bookings || bookingsForSession(currentUser));
                } catch {
                    setBookings(bookingsForSession(currentUser));
                }
            }
        };

        fetchRelated();
    }, [isMyProfile, currentUser]);

    const clientPosts = useMemo(() => {
        if (!client?.username) return [];
        return posts.filter((post) => {
            const postUsername =
                post.artist?.username ||
                post.user?.username ||
                post.author?.username ||
                post.username;
            return postUsername?.toLowerCase() === client.username.toLowerCase();
        });
    }, [posts, client]);

    if (loading) {
        return <Loader />;
    }

    if (!client) {
        return (
            <main className="profile profile-not-found">
                <Header />
                <div className="profile-container">
                    <div className="profile-container-header2">
                        <h1>User not found</h1>
                        <p>
                            We couldn't find a user with the username <strong>@{username}</strong>.
                        </p>
                        <Link to="/artists">Explore ArtistHood</Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const clientName = client.fullName || client.name || "ArtistHood User";
    const clientUsername = client.username || username;
    const profileImage = client.profileImage || client.avatar || client.profilePicture;
    const initial = clientName.charAt(0).toUpperCase();

    return (
        <div className="profile client-profile">
            <Header />
            <div className="profile-banner client-profile-banner">
                <div className="client-banner-overlay">
                    <span>ARTISTHOOD</span>
                </div>
            </div>

            <main className="profile-container">
                {error && isMyProfile === false && (
                    <p className="workspace-banner">{error}</p>
                )}

                <section className="profile-container-header client-header">
                    <div className="profile-container-header-left">
                        {profileImage ? (
                            <img src={profileImage} alt={`${clientName}'s profile`} />
                        ) : (
                            <div className="profile-default-image">{initial}</div>
                        )}
                    </div>

                    <div className="profile-container-header-right">
                        <div className="client-name-row">
                            <div>
                                <div className="profile-container-header-right-name">
                                    <h1>{clientName}</h1>
                                </div>
                                <div className="profile-meta-row">
                                    <span className="profile-container-header-right-username">
                                        @{clientUsername}
                                    </span>
                                    <span className="client-badge">CLIENT</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-container-header-right-profession">
                            Client
                        </div>

                        {client.bio && (
                            <div className="profile-container-header-right-bio">{client.bio}</div>
                        )}

                        {(client.location || getLocalProfile(clientUsername)?.location) && (
                            <div className="profile-location">
                                <span>⌖</span>
                                {client.location || getLocalProfile(clientUsername)?.location}
                            </div>
                        )}

                        <div className="profile-actions">
                            {!isMyProfile && (
                                <button
                                    type="button"
                                    className={`profile-follow-button ${isFollowing ? "is-following" : ""}`}
                                    onClick={() => setIsFollowing((value) => !value)}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            )}
                            {!isMyProfile && (
                                <Link
                                    className="profile-book-button"
                                    to={`/messages?user=${clientUsername}`}
                                >
                                    Message
                                </Link>
                            )}
                            {isMyProfile && (
                                <>
                                    <Link className="profile-book-button" to="/settings">
                                        Edit Profile
                                    </Link>
                                    <Link className="profile-follow-button" to="/booking">
                                        My bookings
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                <section className="profile-container-header2 client-stats">
                    <div className="followers">
                        <span>{client.followers?.length ?? client.followers ?? 0}</span>
                        <span>Followers</span>
                    </div>
                    <div className="followers">
                        <span>{client.following?.length ?? client.following ?? 0}</span>
                        <span>Following</span>
                    </div>
                    <div className="followers">
                        <span>{bookings.length || client.bookings || 0}</span>
                        <span>Bookings</span>
                    </div>
                    <div className="followers">
                        <span>{clientPosts.length}</span>
                        <span>Posts</span>
                    </div>
                </section>

                <section className="client-section">
                    <div className="client-section-heading">
                        <span className="section-eyebrow">PROFILE</span>
                        <h2>About</h2>
                    </div>
                    <div className="client-about-card">
                        <div className="client-about-icon">✦</div>
                        <div>
                            <h3>{clientName}</h3>
                            <p>
                                {client.bio ||
                                    "A member of the ArtistHood creative community looking for talented artists and unique experiences."}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="client-section">
                    <div className="client-section-heading">
                        <span className="section-eyebrow">ACTIVITY</span>
                        <h2>Bookings</h2>
                    </div>
                    {isMyProfile && bookings.length > 0 ? (
                        <div className="upcoming-list">
                            {bookings.map((booking) => (
                                <article className="client-booking-card" key={booking._id}>
                                    <h3>{booking.eventType || "Event"}</h3>
                                    <p>{booking.status || "pending"}</p>
                                    <Link className="client-primary-button" to={`/booking/${booking._id}`}>
                                        View details
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="client-booking-card">
                            <div className="booking-icon">📅</div>
                            <div className="booking-content">
                                <h3>
                                    {isMyProfile
                                        ? "Your bookings will appear here"
                                        : `${clientName} keeps booking activity private`}
                                </h3>
                                <p>
                                    Discover talented artists and book the perfect performer for your next event.
                                </p>
                                <Link to="/artists" className="client-primary-button">
                                    Explore Artists
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                <section className="profile-posts client-section" aria-labelledby="client-posts-title">
                    <div className="profile-posts-header client-section-heading">
                        <span className="section-eyebrow">COMMUNITY</span>
                        <h2 id="client-posts-title">Posts</h2>
                    </div>
                    {clientPosts.length > 0 ? (
                        <div className="profile-post-list">
                            {clientPosts.map((post, index) => (
                                <article className="profile-post" key={post._id || index}>
                                    <div className="profile-post-header">
                                        <strong>{clientName}</strong>
                                        <span>@{clientUsername}</span>
                                    </div>
                                    <p>
                                        {post.caption ||
                                            post.content ||
                                            post.text ||
                                            "Shared a post on ArtistHood."}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="client-empty-posts">
                            <div className="empty-post-icon">✦</div>
                            <h3>No posts yet</h3>
                            <p>
                                When {clientName} shares something with the community, it will appear here.
                            </p>
                        </div>
                    )}
                </section>

                <section className="client-discover-card">
                    <div>
                        <span className="section-eyebrow">FIND YOUR NEXT EXPERIENCE</span>
                        <h2>Discover extraordinary talent.</h2>
                        <p>
                            Connect with singers, dancers, photographers, creators and performers from ArtistHood.
                        </p>
                    </div>
                    <Link to="/artists" className="client-primary-button">
                        Discover Artists
                        <span>→</span>
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}
