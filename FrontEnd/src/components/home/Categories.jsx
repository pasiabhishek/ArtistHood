import React from "react";
import { Link } from "react-router-dom";
import { MdCelebration, MdGraphicEq, MdMic, MdMusicNote, MdRecordVoiceOver, MdTheaterComedy } from "react-icons/md";
import "../../pages/css/HomeSections.css";

const categories = [
    { name: "Singers", icon: MdMic },
    { name: "DJs", icon: MdGraphicEq },
    { name: "Dancers", icon: MdCelebration },
    { name: "Bands", icon: MdMusicNote },
    { name: "Anchors", icon: MdRecordVoiceOver },
    { name: "Comedians", icon: MdTheaterComedy },
];

export default function CategoriesCard() {
    return (
        <section className="home-section categories-section">
            <div className="section-heading">
                <div className="">
                    <h2 className="font-bold text-3xl">Talent for every kind of event.</h2>
                    <p>EXPLORE CATEGORIES</p>
                </div>
                    
                <Link to="/categories">View all categories</Link>
            </div>
            <div className="category-grid">
                {categories.map(({ name, icon: Icon }) => (
                    <Link to="/categories" className="category-card" key={name}>
                        <span>
                            <Icon />
                        </span>
                        <h3>{name}</h3>
                        <p>Discover talent</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
