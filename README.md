<div align="center">

# 🎨 ArtistHood

### Discover • Showcase • Hire Creative Talent

**ArtistHood** is a full-stack MERN platform that connects artists with clients through a seamless booking experience. Artists showcase their work and get discovered, while clients explore talent, chat, book and pay securely online.

<p align="center">
  <a href="https://artist-hood.vercel.app">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-artist--hood.vercel.app-success?style=for-the-badge" />
  </a>
  <a href="https://github.com/pasiabhishek/ArtistHood">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-0C2451?style=flat-square&logo=razorpay&logoColor=white" />
</p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [UI/UX Design](#uiux-design)
- [Tech Stack](#technology-stack)
- [Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Booking & Payment Flow](#booking--payment-flow)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Live Demo](#live-demo)
- [Contributors](#-contributors)
- [Collaboration](#-collaboration)
- [Copyright](#copyright)

---

## Overview

Finding the right artist for a wedding, concert, corporate event or private celebration usually means jumping between social media, messaging apps and scattered portfolios. **ArtistHood** puts discovery, communication, booking and payment in one place.

- **Artists** create a professional profile, post photos, videos and audio, and manage incoming booking requests.
- **Clients** browse artists by category, view profiles, message them, send booking requests and pay once a request is accepted.

---

## Features

### For Clients
- Browse and search artists across 28+ performance categories (singers, DJs, bands, dancers, comedians, magicians, anchors and more)
- View detailed artist profiles with pricing, experience, location and social links
- Send booking requests with date, time, event type, guest count and location
- Track every booking from request to confirmation
- Pay securely through Razorpay once the artist accepts
- Message artists directly

### For Artists
- Dedicated artist onboarding and profile (stage name, category, bio, experience, city, pricing model, availability)
- Share image, video and audio posts to a public feed
- Accept or reject booking requests from a single dashboard
- Receive in-app notifications for bookings and payments
- Upload and update profile photo

### Platform
- JWT-based authentication with role-based access (**Client** / **Artist**)
- Bcrypt password hashing
- Cloud media storage through Cloudinary
- In-app notification system
- One-to-one conversations with unread tracking
- Responsive UI with a skip-to-content link for keyboard users

---

## UI/UX Design

ArtistHood uses a dark, stage-inspired interface that keeps artists' content at the centre. The design is built around one question: how quickly can a client go from *"I need a performer"* to *"booking sent"*?

### Design Principles

| Principle | How it shows up |
|---|---|
| **Clarity first** | One primary action per screen, such as *Explore artists*, *Send request* or *Pay now*. Secondary actions are visually quieter. |
| **Content-forward** | Dark surfaces and soft borders make photos, videos and artist cards stand out instead of the chrome around them. |
| **Low-friction journeys** | Role selection at signup, a short booking form, and live booking status keep each task to a few steps. |
| **Consistent system** | Colours, radii, shadows and focus styles come from shared CSS design tokens, so every screen feels like one product. |
| **Inclusive by default** | Keyboard, screen-reader and reduced-motion users are supported (see [Accessibility](#accessibility)). |

### Visual Language

| Element | Choice |
|---|---|
| **Theme** | Deep midnight background with layered surfaces and a soft violet glow |
| **Accent colour** | Violet / indigo, used for primary buttons, links and focus states |
| **Headings & logo** | *Cormorant Garamond*, an elegant serif that gives the brand a creative, premium tone |
| **Body text** | *Manrope*, a clean sans-serif that stays readable at small sizes |
| **Shape** | Rounded corners (10px, 14px and 22px) and soft shadows for approachable cards and buttons |

<details>
<summary><b>Design tokens</b></summary>

<br>

| Token | Value | Use |
|---|---|---|
| `--background` | `#070b18` | Page background |
| `--surface` / `--surface-2` | `#10162a` / `#161d35` | Panels and raised areas |
| `--card-background` | `#121833` | Cards |
| `--btn-bg` | `#6d5ef5` | Primary buttons |
| `--btn-bg-hover` | `#7f71ff` | Button hover |
| `--text-color` | `#f4f6ff` | Primary text |
| `--text-muted` | `#a8aec8` | Secondary text |
| `--radius-sm / md / lg` | `10px / 14px / 22px` | Corner radii |
| `--focus` | `0 0 0 3px rgba(125,110,245,.35)` | Keyboard focus ring |
| `--header-height` | `72px` | Fixed header offset |

</details>

### Key User Journeys

**Client: find and book an artist**

`Landing page` → `Browse / filter artists` → `Artist profile` → `Booking request` → `Artist accepts` → `Pay with Razorpay` → `Booking confirmed`

**Artist: get discovered and manage work**

`Choose role` → `Create artist profile` → `Post photos, video or audio` → `Receive request` → `Accept or reject` → `Get paid`

### Interface Patterns

- **Persistent app layout:** a left navigation, centre content area and right panel for signed-in screens (feed, discover, bookings, messages, notifications, settings)
- **Feature-first screens:** landing, feed, discover, artist profile, booking, dashboard, messages, notifications and settings, each with its own page and styles
- **Dashboard at a glance:** stat cards for total requests, requests awaiting response and accepted bookings
- **Clear system feedback:** loaders for waiting states, `role="status"` messages for progress and `role="alert"` messages for errors
- **Guarded routes:** signed-out visitors are sent to login before reaching private pages
- **Custom 404 page** for unknown routes

### Accessibility

> [!NOTE]
> Accessibility is part of the build, not an afterthought.

- **Skip-to-content link** for keyboard users
- **Visible focus states** using `:focus-visible` and a consistent focus ring
- **Semantic landmarks and ARIA** labels, live regions, `aria-expanded` and `aria-controls` on interactive widgets
- **Decorative icons hidden** from assistive technology with `aria-hidden`
- **Reduced motion:** animations are switched off for users who set `prefers-reduced-motion`
- **Readable contrast:** light text on dark surfaces, with muted text reserved for secondary information

### Responsive Design

The layout adapts across desktop, tablet and mobile using breakpoints at roughly `900px`, `800px` and `640px`. Navigation, card grids and forms reflow to a single column on small screens, with no horizontal scrolling.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router 7, Vite, Tailwind CSS 4, Axios, React Icons |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB (Atlas in production, in-memory fallback for local development) |
| **Authentication** | JSON Web Tokens, bcryptjs |
| **Media Storage** | Cloudinary, Multer (50 MB upload limit) |
| **Payments** | Razorpay (Test Mode) |
| **Tooling** | Nodemon, Oxlint |
| **Hosting** | Vercel (frontend), MongoDB Atlas |

---

## System Architecture

```text
┌───────────────────────────┐
│  React + Vite (Frontend)  │   Vercel
│  Tailwind CSS · Axios     │
└─────────────┬─────────────┘
              │  REST / JSON  (Bearer JWT)
              ▼
┌───────────────────────────┐        ┌──────────────┐
│   Express API (Backend)   │───────▶│  Cloudinary  │  media uploads
│   Routes → Controllers    │        └──────────────┘
│   Auth middleware (JWT)   │        ┌──────────────┐
│                           │───────▶│   Razorpay   │  payments
└─────────────┬─────────────┘        └──────────────┘
              │  Mongoose
              ▼
┌───────────────────────────┐
│       MongoDB Atlas       │
└───────────────────────────┘
```

---

## Project Structure

```text
ArtistHood
├── FrontEnd/                     # React application
│   ├── public/                   # Static assets (logo, favicon, hero image)
│   ├── src/
│   │   ├── app/                  # App shell and route definitions
│   │   ├── features/             # Feature-first modules (pages, components, styles)
│   │   │   ├── auth/             # Login, signup, role selection, artist signup
│   │   │   ├── artists/          # Artist listing and profile pages
│   │   │   ├── bookings/         # Booking list, request form, booking details
│   │   │   ├── dashboard/        # User dashboard
│   │   │   ├── discover/         # Artist discovery
│   │   │   ├── messages/         # Conversations and chat
│   │   │   ├── notifications/    # Notification centre
│   │   │   ├── posts/            # Feed, post creation, post cards
│   │   │   ├── settings/         # Account settings
│   │   │   └── site/             # Landing page, header, static pages
│   │   ├── shared/               # Reusable layout, hooks, services, data
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vercel.json               # SPA rewrite rules
│   └── vite.config.js
│
├── backend/                      # Express REST API
│   ├── config/                   # Database, Cloudinary, Razorpay setup
│   ├── controllers/              # Request handlers (auth, artist, booking, ...)
│   ├── middleware/               # JWT protection, file upload
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Route definitions
│   ├── utils/                    # Token generation, notification helper
│   └── server.js                 # Entry point
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (optional for local development)
- [Cloudinary](https://cloudinary.com/) account (for image, video and audio uploads)
- [Razorpay](https://razorpay.com/) account with test keys (for payments)

### 1. Clone the repository

```bash
git clone https://github.com/pasiabhishek/ArtistHood.git
cd ArtistHood
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm run dev      # development with auto-reload (nodemon)
# or
npm start        # production
```

The API runs at **http://localhost:5000**.

> [!TIP]
> If `MONGO_URI` is not set, the server starts an in-memory MongoDB instance so you can try the app without a database. Data is lost when the server stops.

### 3. Set up the frontend

In a new terminal:

```bash
cd FrontEnd
npm install
```

Create a `.env` file in `FrontEnd/`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

### Available Scripts

| Location | Command | Description |
|---|---|---|
| `FrontEnd` | `npm run dev` | Start the Vite dev server |
| `FrontEnd` | `npm run build` | Create a production build |
| `FrontEnd` | `npm run preview` | Preview the production build |
| `FrontEnd` | `npm run lint` | Lint with Oxlint |
| `backend` | `npm run dev` | Start the API with Nodemon |
| `backend` | `npm start` | Start the API with Node |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default `5000`) |
| `MONGO_URI` | Recommended | MongoDB connection string. Falls back to an in-memory database if unset |
| `JWT_SECRET` | **Yes** | Secret used to sign authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | **Yes** | Razorpay key ID (test or live) |
| `RAZORPAY_KEY_SECRET` | **Yes** | Razorpay key secret |

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/artisthood
JWT_SECRET=replace_with_a_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (`FrontEnd/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes** | Base URL of the backend API, without a trailing slash |

> [!WARNING]
> Never commit `.env` files. They are already listed in `.gitignore`.

---

## API Reference

All endpoints are prefixed with `/api`. Routes marked 🔒 require an `Authorization: Bearer <token>` header.

### Authentication: `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | | Register a new user |
| POST | `/login` | | Log in and receive a JWT |
| GET | `/me` | 🔒 | Get the current user |
| POST | `/artist-signup` | 🔒 | Create an artist profile |

### Users: `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/update-image` | 🔒 | Update profile image (`multipart/form-data`, field `profileImage`) |

### Artists: `/api/artists`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | | List all artists |
| GET | `/me` | 🔒 | Get my artist profile |
| GET | `/:username` | | Get an artist by username |
| PUT | `/update` | 🔒 | Update my artist profile |

### Posts: `/api/posts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | | Get all posts (feed) |
| GET | `/:username` | 🔒 | Get posts by an artist |
| POST | `/create` | 🔒 | Create a post (`multipart/form-data`, field `media`) |

### Bookings: `/api/bookings` (all routes 🔒)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-booking` | Create a booking request |
| GET | `/client-bookings` | Bookings made by the logged-in client |
| GET | `/artist-bookings` | Bookings received by the logged-in artist |
| GET | `/:id` | Get booking details |
| PUT | `/:id/accept` | Artist accepts a booking |
| PUT | `/:id/reject` | Artist rejects a booking |

### Payments: `/api/payments` (all routes 🔒)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-order` | Create a Razorpay order for a booking |
| POST | `/verify` | Verify the Razorpay payment signature |

### Messages: `/api/messages` (all routes 🔒)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/conversations` | List my conversations |
| POST | `/conversations` | Start a conversation |
| GET | `/conversations/:id` | Get messages in a conversation |
| POST | `/conversations/:id` | Send a message |
| PATCH | `/conversations/:id/read` | Mark a conversation as read |

### Notifications: `/api/notifications` (all routes 🔒)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List my notifications |
| PATCH | `/:id/read` | Mark a notification as read |

---

## Data Models

| Model | Purpose | Key fields |
|---|---|---|
| **User** | Account for every person on the platform | `fullName`, `username`, `email`, `password` (hashed), `role` (`Client` / `Artist`), `profileImage` |
| **ArtistProfile** | Public profile linked one-to-one with an Artist user | `stageName`, `category`, `bio`, `experience`, `city`, `state`, `price`, `priceType`, `availableFrom`, `rating`, `isVerified`, social links |
| **Post** | Media shared by an artist | `artist`, `caption`, `media`, `mediaType` (`image` / `video` / `audio`), `likes[]` |
| **Booking** | A client's request to hire an artist | `client`, `artist`, `eventDate`, `startTime`, `endTime`, `eventType`, `expectedGuests`, `location`, `price`, `status` |
| **Payment** | Razorpay transaction for a booking | `booking`, `client`, `amount`, `currency`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `status` |
| **Conversation** | One-to-one chat thread | `participants`, `participantKey` (unique), `lastMessage`, `lastMessageAt` |
| **Message** | A single chat message | `conversation`, `sender`, `recipient`, `text`, `readAt` |
| **Notification** | In-app alert | `user`, `type`, `title`, `body`, `href`, `booking`, `read` |

Booking statuses: `pending` → `accepted` / `rejected` → `confirmed` → `completed` / `cancelled`

---

## Booking & Payment Flow

```text
Client                         Artist                        System
  │  1. Send booking request     │                              │
  │ ───────────────────────────▶ │                              │
  │                              │  2. Notified (pending)       │
  │                              │  3. Accept or reject         │
  │ ◀─────────────────────────── │                              │
  │  4. Notified of decision     │                              │
  │  5. Pay via Razorpay ───────────────────────────────────▶   │
  │                              │            6. Verify signature
  │ ◀──────────────────────────────────────────────────────────  │
  │  7. Booking confirmed        │  Payment-confirmed notice    │
```

> [!NOTE]
> Payments run in Razorpay **Test Mode**. Use [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-details/) to try the flow. No real money is charged.

---

## Deployment

- **Frontend:** Deploy `FrontEnd/` to Vercel. Set `VITE_API_URL` in the project settings. `vercel.json` rewrites all routes to `index.html` so client-side routing works on refresh.
- **Backend:** Deploy `backend/` to any Node host (Render, Railway, etc.) with the environment variables above. Use MongoDB Atlas and allow the host's IP address in the Atlas network access list.

---

## Roadmap

- ✅ Landing Page
- ✅ Responsive Design
- ✅ User Authentication (Client & Artist roles)
- ✅ Artist Profiles
- ✅ Media Posts & Feed
- ✅ Artist Booking System
- ✅ Direct Messaging
- ✅ Notifications
- ✅ Payment Gateway (Razorpay, Test Mode)
- 🔄 Reviews & Ratings
- 🔄 Real-time Chat (WebSockets)
- 🔄 Admin Dashboard
- 🔄 AI-Powered Artist Recommendations
- 🔄 Progressive Web App (PWA)

## Live Demo

🌐 **https://artist-hood.vercel.app/**

---

## 👨‍💻 Contributors

ArtistHood was collaboratively developed by two developers, with dedicated responsibilities across frontend and backend development.

### 1. Pasi Abhishek
**Role: Frontend Developer**

- Developed the responsive UI using React.js and Tailwind CSS.
- Built reusable components, pages, layouts and routing.
- Implemented frontend functionality and navigation.
- Integrated backend APIs for authentication, artist profiles, posts, bookings, payments, messaging and notifications.

**Portfolio:** [pasi-abhishek.netlify.app](https://pasi-abhishek.netlify.app/)

**GitHub:** [github.com/pasiabhishek](https://github.com/pasiabhishek)

### 2. Vikas Prajapati
**Role: Backend Developer**

- Developed the backend using Node.js and Express.js.
- Built RESTful APIs and CRUD operations.
- Managed the MongoDB database and Mongoose models.
- Implemented JWT authentication, authorization and password security.
- Developed backend functionality for profiles, posts, bookings, messaging and notifications.
- Integrated Cloudinary media uploads and the Razorpay payment gateway (Test Mode).

**Portfolio:** [portfolio-vikasprajapati.vercel.app](https://portfolio-vikasprajapati.vercel.app/)

**GitHub:** [vikasprajapati3](https://github.com/vikasprajapati3)

---

## 🤝 Collaboration

ArtistHood is the result of collaborative development, combining frontend design and backend engineering to create a platform that connects artists with clients.

Both contributors worked together on development and integration to deliver a seamless full-stack application.

---

## Copyright

**Copyright © 2026 Pasi Abhishek and Vikas Prajapati**

**All Rights Reserved.**

This software and its source code are the intellectual property of **Pasi Abhishek and Vikas Prajapati**.

Permission is **NOT** granted to use, copy, modify, merge, publish, distribute, sublicense, sell, or create derivative works from this software without prior written permission from the copyright holders.

This repository is made publicly available **for viewing and reference purposes only**.

Unauthorized use, reproduction, distribution, or commercial use of this software, in whole or in part, may result in legal action.

---

<div align="center">

### Built with the MERN Stack

**Empowering artists. Connecting creativity.**

© 2026 Pasi Abhishek and Vikas Prajapati. All Rights Reserved.

</div>
