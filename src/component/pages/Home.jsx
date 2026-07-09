import React from 'react'
import './Home.css'
import Header from '../common/Header'
import Hero from '../common/Hero'
import Categories_card from '../common/Categories_card';
import Featured_artist from '../common/Featured_artist';



export default function Home() {
    return (
        <div>

            <Hero />
            <Categories_card />
            <Featured_artist/>
        </div>
    )
}