import React from "react";
import Categories from "../components/home/Categories";
import FeaturedArtists from "../components/home/FeaturedArtists";
import Hero from "../components/home/Hero";
import WhyArtistHood from "../components/home/WhyArtistHood";
import useTitle from "./UseTitle";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

export default function Home() {
    useTitle("Home")

    return (
        <div>
            <Header />
            <Hero
                tagline="India's Premium Artist Booking Platform."
                para=" Discover and look top singers , DJs , dancers and performers for your events."
            />
            <WhyArtistHood />
            <Categories />
            <FeaturedArtists />
            <Footer />

        </div>
    );
}
