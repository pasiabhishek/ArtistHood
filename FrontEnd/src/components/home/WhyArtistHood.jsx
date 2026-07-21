import React from "react";
import {
    MdCalendarMonth,
    MdPayments,
    MdSentimentSatisfied,
    MdStarRate,
    MdSupportAgent,
    MdVerifiedUser,
} from "react-icons/md";
import "../../pages/css/HomeSections.css";

const features = [
    {
        title: "Verified artists",
        text: "Every artist is quality checked before joining our community.",
        Icon: MdVerifiedUser,
    },
    {
        title: "Secure bookings",
        text: "Simple, transparent bookings from first enquiry to final performance.",
        Icon: MdPayments,
    },
    {
        title: "Helpful support",
        text: "Our team is here to help you find the right fit for your event.",
        Icon: MdSupportAgent,
    },
];
const stats = [
    { value: "500+", label: "Artists", Icon: MdSentimentSatisfied },
    { value: "10K+", label: "Bookings", Icon: MdCalendarMonth },
    { value: "4.9★", label: "Average rating", Icon: MdStarRate },
];
export default function WhyAH() {
    return (
        <section className="why-section">
            <div className="home-section">
                <div className="section-heading why-heading">
                    <p>WHY ARTISTHOOD</p>
                    <h2>Booking made memorable.</h2>
                </div>
                <div className="feature-grid">
                    {features.map(({ title, text, Icon }) => (
                        <article key={title}>
                            <Icon />
                            <div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="stats-grid">
                    {stats.map(({ value, label, Icon }) => (
                        <div key={label}>
                            <Icon />
                            <strong>{value}</strong>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
