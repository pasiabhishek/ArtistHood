import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


function App() {
  return (
    <div className="hero">
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
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-tagline">
            India's Premium Artist Booking Platform.
          </p>
          <h1>
            BOOK YOUR <br /> FAVORITE
            <br />
            <span>ARTIST...</span>
          </h1>
          <p className="hero-para">
            Discover and look top singers , DJs , dancers and performers for your events.
          </p>
        </div>
        <div className="blank">

        </div>
      </div>
    </div>



  )

}

export default App

 