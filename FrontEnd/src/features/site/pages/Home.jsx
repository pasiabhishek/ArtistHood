import React from "react";
import Categories from "../components/Categories";
import FeaturedArtists from "../components/FeaturedArtists";
import Hero from "../components/Hero";
import WhyArtistHood from "../components/WhyArtistHood";
import useTitle from "../../../shared/hooks/useTitle";
import Footer from "../../../shared/components/layout/Footer";
import Header from "../components/Header";

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
