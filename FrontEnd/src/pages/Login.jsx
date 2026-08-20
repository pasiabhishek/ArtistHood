import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Auth.css";
import useTitle from "./UseTitle";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Submit credentials to the API, then keep the returned session details locally.
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                formData
            );

            // The token is used by later authenticated requests.
            localStorage.setItem("token", res.data.user.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/Feed");
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

        useTitle("Login") 
    

    return (
        <main className="auth-page">
            <nav className="auth-nav">
                <Link className="logo" to="/" aria-label="ArtistHood home">
                    ARTIST<span>HOOD</span>
                </Link>
                <p>
                    New to ArtistHood? <Link to="/signup">Create an account</Link>
                </p>
            </nav>
            <section className="auth-content" aria-labelledby="login-heading">
                <div className="auth-intro">
                    <p className="auth-eyebrow">WELCOME BACK</p>
                    <h1>Your next great event starts here.</h1>
                    <p>Log in to manage your bookings and discover remarkable artists for every occasion.</p>
                </div>
                <div className="auth-card">
                    <div className="auth-card-heading">
                        <h2 id="login-heading">Welcome back</h2>
                        <p>Enter your details to continue to ArtistHood.</p>
                    </div>
                    <form className="auth-form" onSubmit={handleLogin}>
                        <label>
                            Email address
                            <input
                                value={formData.email}
                                onChange={(event) => setFormData(
                                    { ...formData, email: event.target.value }
                                )}
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
                                    value={formData.password}
                                    onChange={(event) => setFormData(
                                        { ...formData, password: event.target.value }
                                    )}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword((value) => !value)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>
                        <div className="auth-form-options">
                            <label className="auth-check">
                                <input type="checkbox" name="remember" />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot-password">Forgot password?</a>
                        </div>
                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                    <p className="auth-switch">
                        New to ArtistHood? <Link to="/signup">Create an account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
