import React from "react";
import Categories from "../components/home/Categories";
import FeaturedArtists from "../components/home/FeaturedArtists";
import Hero from "../components/home/Hero";
import WhyArtistHood from "../components/home/WhyArtistHood";
import useTitle from "../hooks/useTitle";
import Footer from "../components/layout/Footer";
import Header from "../components/home/Header";

export default function Home() {
    // Home is assembled from small sections so each area can be maintained independently.
    useTitle("Home")
    return (
        <div id="main-content">
            <Header />
            <Hero
                tagline="India's premium artist booking platform"
                para="Discover and book top singers, DJs, dancers, and performers for every kind of event."
            />
            <WhyArtistHood />
            <Categories />
            <FeaturedArtists />
            <Footer />
        </div>
    );
}
