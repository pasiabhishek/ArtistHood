import React from 'react'
import './Home.css'
import Hero from '../common/Hero'
import Categories_card from '../common/Categories_card';
import Featured_artist from '../common/Featured_artist';
import Why_AH from '../common/Why_AH';
import Footer from '../common/Footer';



export default function Home() {
    return (
        <div>
            <Hero tagline="India's Premium Artist Booking Platform." para=" Discover and look top singers , DJs , dancers and performers for your events."/>
            <Categories_card />
            <Featured_artist />
            <Why_AH />

        </div>
    )
}