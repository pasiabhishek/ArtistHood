# 🎨 Artisthood

> **Where talent meets opportunity.**

Finding the right artist for an event shouldn't be complicated, and talented artists deserve a place where their work can be seen. **Artisthood** was built to make that connection easier.

Whether you're a client planning a wedding, concert, corporate event, or private celebration, or an artist looking to showcase your talent and grow your career, Artisthood brings everyone together on one platform.

With artist profiles, easy search, booking requests, real-time communication, and reviews, we make the booking experience simple, transparent, and stress-free.

## ✨ What You Can Do

### For Clients

* Browse talented artists across different categories.
* Search and filter artists based on your needs.
* View detailed profiles, portfolios, and reviews.
* Send booking requests with ease.
* Track your bookings from request to confirmation.

### For Artists

* Create a professional profile that showcases your talent.
* Upload photos, videos, and portfolio content.
* Manage booking requests in one place.
* Build credibility through client ratings and reviews.
* Reach more people and grow your audience.

## 💡 Why Artisthood?

We believe every artist deserves opportunities, and every event deserves the perfect performance. Our goal is to create a community where creativity thrives and meaningful connections happen effortlessly.

Whether you're discovering new talent or sharing your own, Artisthood is here to make every booking experience smooth, reliable, and enjoyable.

**Made with ❤️ for artists, creators, and dreamers.**

## Frontend source structure

The frontend source is organized by product feature. Route-level screens and
feature-specific components, data, services, and styles live together; reusable
application infrastructure lives in `src/shared`.

```text
src/
  app/                 Application routes and composition
  features/
    artists/           Artist discovery, profiles, and client profiles
    auth/              Sign-in, sign-up, and role selection
    bookings/          Booking requests and booking details
    dashboard/         Artist dashboard
    discover/          Discovery feed
    messages/          Conversations and chat
    notifications/     Notification screens and components
    posts/             Post feed, creation, and detail
    settings/          Account settings
    site/              Public landing and informational pages
  shared/
    components/        Reusable layout and common components
    data/              Data shared across features
    hooks/             Reusable React hooks
    services/          API and shared client-side services
    styles/            Shared styles
  index.css            Global styles
  main.jsx             Frontend entry point
```
