import React from "react";
import Categories from "../components/home/Categories";
import FeaturedArtists from "../components/home/FeaturedArtists";
import Hero from "../components/home/Hero";
import WhyArtistHood from "../components/home/WhyArtistHood";
import useTitle from "./UseTitle";

export default function Home() {
    useTitle("Home") 
    
    return (
        <div>
            <Hero
                tagline="India's Premium Artist Booking Platform."
                para=" Discover and look top singers , DJs , dancers and performers for your events."
            />
            <Categories />
            <FeaturedArtists />
            <WhyArtistHood />
        </div>
    );
}
