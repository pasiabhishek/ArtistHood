import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Auth.css";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <main className="auth-page">
            <nav className="auth-nav">
                <Link className="logo" to="/" aria-label="ArtistHood home">
                    ARTIST<span>HOOD</span>
                </Link>
                <p>
                    Already a member? <Link to="/login">Log in</Link>
                </p>
            </nav>
            <section className="auth-content" aria-labelledby="signup-heading">
                <div className="auth-intro">
                    <p className="auth-eyebrow">ARTISTHOOD COMMUNITY</p>
                    <h1>Bring your next event to life.</h1>
                    <p>Join ArtistHood to discover, connect with, and book exceptional talent.</p>
                </div>
                <div className="auth-card">
                    <div className="auth-card-heading">
                        <h2 id="signup-heading">Create your account</h2>
                        <p>Start your ArtistHood journey today.</p>
                    </div>
                    <form className="auth-form">
                        <div className="auth-name-row">
                            <label>
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    autoComplete="given-name"
                                    required
                                />
                            </label>
                            <label>
                                Last name
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    autoComplete="family-name"
                                    required
                                />
                            </label>
                        </div>
                        <label>
                            Email address
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </label>
                        <label>
                            Password
                            <div className="password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    minLength="8"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword((value) => !value)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>
                        <p className="auth-password-note">Use at least 8 characters.</p>
                        <label className="auth-check">
                            <input type="checkbox" required />
                            <span>I agree to the Terms of Service and Privacy Policy.</span>
                        </label>
                        <button className="auth-submit" type="submit">
                            Create account
                        </button>
                    </form>
                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
