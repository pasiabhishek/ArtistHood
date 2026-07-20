import React from 'react'
import './Hero.css'
import Header from './Header'

export default function Hero(prop) {
    return (
        <div>
            <div className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <p className="hero-tagline">
                          {prop.tagline} 
                        </p>
                        <h1>
                            BOOK YOUR <br /> FAVORITE
                            <br />
                            <span>ARTIST...</span>
                        </h1>
                        <p className="hero-para">
                          {prop.para}
                        </p>
                    </div>
                    <div className="blank">

                    </div>
                </div>
            </div>




        </div>
    )
}
