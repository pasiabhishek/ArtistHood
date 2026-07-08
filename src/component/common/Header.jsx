import React from 'react'
import './Header.css'
export default function Header() {
  return (
    <div>
        <nav className="nav">
        <div className="logo">
          ARTIST<span>HOOD</span>
        </div>
        <div className="navbar">
          <ul>
            <li>Home</li>
            <li>Artist</li>
            <li>Categories</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="logsign">
          <button className="login">Login</button   >
          <button className="signup">Get Started</button>
        </div>
      </nav>
    
    </div>
  )
}
