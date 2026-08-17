import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Auth.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://artisthood-1.onrender.com/";

export default function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleSignUP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                password: formData.password
            };

            const res = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                payload
            );

            localStorage.setItem("token", res.data.user.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert("Account Created");
            navigate("/Login");
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        } finally {
            setLoading(false);
        }
    };

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
                    <form className="auth-form" onSubmit={handleSignUP}>
                        <div className="auth-name-row">
                            <label>
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    autoComplete="given-name"
                                    required
                                    value={formData.firstName}
                                    onChange={(event) => setFormData(
                                        { ...formData, firstName: event.target.value }
                                    )}
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
                                    value={formData.lastName}
                                    onChange={(event) => setFormData(
                                        { ...formData, lastName: event.target.value }
                                    )}
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
                                value={formData.email}
                                onChange={(event) => setFormData(
                                    { ...formData, email: event.target.value }
                                )}
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
                                    value={formData.password}
                                    onChange={(event) => setFormData(
                                        { ...formData, password: event.target.value }
                                    )}
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
                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create account"}
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
