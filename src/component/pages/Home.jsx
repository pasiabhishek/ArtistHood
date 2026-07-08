import React from 'react'
import './Home.css'
import Header from '../common/Header'
import Hero from '../common/Hero'
import Categories_card from '../common/Categories_card';





export default function Home() {
    return (
        <div>
            <Hero />
            <Categories_card />
        </div>
    )
}