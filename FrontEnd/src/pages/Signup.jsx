import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Auth.css";
import axios from "axios";


export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [addSignUp, addNewSignUp] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const handleSignUP = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                addSignUp
            );

            console.log(res.data);

            alert("Account Created");

        } catch (err) {

            console.log(err);

            alert("Signup Failed");

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
                    <div className="auth-form">
                        <div className="auth-name-row">
                            <label>
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    autoComplete="given-name"
                                    required
                                    onChange={(event) => addNewSignUp(
                                        { ...addSignUp, firstName: event.target.value }
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
                                    onChange={(event) => addNewSignUp(
                                        { ...addSignUp, lastName: event.target.value }
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
                                onChange={(event) => addNewSignUp(
                                    { ...addSignUp, email: event.target.value }
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
                                    onChange={(event) => addNewSignUp(
                                        { ...addSignUp, password: event.target.value }
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
                        <button className="auth-submit" type="submit"
                            onClick={handleSignUP}
                        >
                            Create account
                        </button>
                    </div>
                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
