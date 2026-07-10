import React from 'react'
import './Hero.css'
import Header from './Header'

export default function Hero() {
    return (
        <div>
            <div className="hero">
                <Header></Header>
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




        </div>
    )
}
