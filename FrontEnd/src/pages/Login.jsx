import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Auth.css";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [addLogin, AddNewLogin] = useState();
    const handleLogin = () => {
        console.log(addLogin)
    }
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
                    <div className="auth-form">
                        <label>
                            Email address
                            <input
                                onChange={(event) => AddNewLogin(
                                    { ...addLogin, Email: event.target.value }
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
                                    onChange={(event) => AddNewLogin(
                                        { ...addLogin, Password: event.target.value }
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
                                <input type="checkbox" name="remember"
                                    onChange={(event) => addNewLogin(
                                        {...addLogin, Remember: event.target.value}
                                )}
                                    />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot-password">Forgot password?</a>
                        </div>
                        <button onClick={handleLogin} className="auth-submit" type="submit">
                            Log in
                        </button>
                    </div>
                    <p className="auth-switch">
                        New to ArtistHood? <Link to="/signup">Create an account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
