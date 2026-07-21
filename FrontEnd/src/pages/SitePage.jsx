import React from "react";
import { Link } from "react-router-dom";
import "./css/SitePage.css";

const pageContent = {
  artists: {
    eyebrow: "DISCOVER TALENT",
    title: "Find an artist for every moment.",
    text: "Browse talented performers and make your next celebration unforgettable.",
    items: ["Verified performers", "Simple booking process", "Personalised event matches"],
  },
  categories: {
    eyebrow: "EXPLORE CATEGORIES",
    title: "The right sound, style, and energy.",
    text: "From intimate gatherings to big stages, discover artists across every kind of performance.",
    items: ["Singers & bands", "DJs & dancers", "Hosts & entertainers"],
  },
  about: {
    eyebrow: "ABOUT ARTISTHOOD",
    title: "Great events begin with great people.",
    text: "ArtistHood makes it easy to discover and book memorable talent for every occasion.",
    items: ["Trusted artist network", "Transparent bookings", "Support from start to finish"],
  },
  contact: {
    eyebrow: "GET IN TOUCH",
    title: "Let’s plan something remarkable.",
    text: "Whether you are booking talent or looking to join our artist community, we would love to hear from you.",
    items: ["Event booking help", "Artist partnerships", "General support"],
  },
  careers: {
    eyebrow: "CAREERS",
    title: "Help create unforgettable experiences.",
    text: "We are building a better way to connect exceptional talent with remarkable events.",
    items: ["Creative collaboration", "Meaningful work", "Growing community"],
  },
  privacy: {
    eyebrow: "PRIVACY POLICY",
    title: "Your privacy matters to us.",
    text: "ArtistHood is committed to handling your information responsibly and transparently.",
    items: ["Clear data practices", "Secure information", "Your choices respected"],
  },
  terms: {
    eyebrow: "TERMS OF SERVICE",
    title: "Simple terms for better bookings.",
    text: "Our terms help create clear, fair, and reliable experiences for clients and artists.",
    items: ["Transparent bookings", "Fair expectations", "Trusted community"],
  },
  refunds: {
    eyebrow: "REFUND POLICY",
    title: "Confidence when plans change.",
    text: "We aim to make every booking transparent, including how changes and refunds are handled.",
    items: ["Clear cancellation terms", "Booking support", "Helpful resolutions"],
  },
};

export default function SitePage({ page }) {
  const content = pageContent[page] ?? pageContent.about;

  return (
    <main className="site-page">
      <section className="site-page-hero">
        <p className="site-page-eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="site-page-copy">{content.text}</p>
        <Link className="site-page-cta" to="/signup">Get started</Link>
      </section>
      <section className="site-page-cards" aria-label={`${page} highlights`}>
        {content.items.map((item, index) => (
          <article key={item}>
            <span>0{index + 1}</span>
            <h2>{item}</h2>
            <p>ArtistHood helps you move from idea to an unforgettable event with confidence.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
