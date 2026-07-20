import React, { useState } from "react";
import "./Header.css";
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
        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation */}
        <div className={`navbar ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/artist">Artist</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          {/* Mobile Buttons */}
          <div className="logsign mobile-btn">
            <Link to={'/login'}>
              <button className="login">Login</button>
            </Link>
            <Link to="/signup">
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