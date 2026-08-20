import React, { useState } from "react";
import "../../pages/css/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-gray-950">
            <nav className="nav bg-gray-950">
                {/* Logo */}
                <div className="logo">
                    ARTIST<span className="">HOOD</span>
                </div>

                {/* Hamburger Icon */}
                <button
                    className="menu-icon"
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((isOpen) => !isOpen)}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Navigation */}
                <div id="primary-navigation" className={`navbar ${menuOpen ? "active" : ""}`}>
                    {/* <ul>
                        <li>
                            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        </li>
                        <li>
                            <Link to="/artist" onClick={() => setMenuOpen(false)}>Artist</Link>
                        </li>
                        <li>
                            <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                        </li>
                    </ul> */}

                    {/* Mobile Buttons */}
                    <div className="logsign mobile-btn">
                        <Link to={"/login"} onClick={() => setMenuOpen(false)}>
                            <button className="login">Login</button>
                        </Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                            <button className="signup">Get Started</button>
                        </Link>
                    </div>
                </div>

                {/* Desktop Buttons */}
                <div className="logsign desktop-btn">
                    <Link to="/login">
                        <button className="login">Login</button>
                    </Link>
                    <Link to="/signup">
                        <button className="signup">Get Started</button>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
