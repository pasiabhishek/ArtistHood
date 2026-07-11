import React from 'react'
import './Home.css'
import Header from '../common/Header'
import Hero from '../common/Hero'
import Categories_card from '../common/Categories_card';
import Featured_artist from '../common/Featured_artist';
import Why_AH from '../common/Why_AH';
import Footer from '../common/Footer';



export default function Home() {
    return (
        <div>
            <Hero />
            <Categories_card />
            <Featured_artist />
            <Why_AH />
            <Footer/>

        </div>
    )
}