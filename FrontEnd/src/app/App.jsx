import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../shared/components/layout/AppLayout";
import Home from "../features/site/pages/Home";
import Login from "../features/auth/pages/Login";
import NotFound from "../features/site/pages/NotFound";
import Signup from "../features/auth/pages/Signup";
import ArtistSignUp from "../features/auth/pages/ArtistSignUp";
import SitePage from "../features/site/pages/SitePage";
import Feed from "../features/posts/components/Feed";
import SelectRole from "../features/auth/pages/SelectRole";
import CreatePost from "../features/posts/components/CreatePost";
import Discover from "../features/discover/pages/Discover";
import NotificationPage from "../features/notifications/pages/NotificationPage";
import Message from "../features/messages/pages/Message";
import Booking from "../features/bookings/pages/Booking";
import BookingDetails from "../features/bookings/pages/BookingDetails";
import BookingRequest from "../features/bookings/pages/BookingRequest";
import Artists from "../features/artists/pages/Artists";
import ArtistsList from "../features/artists/pages/ArtistsList";
import Client from "../features/artists/pages/Client";
import Post from "../features/posts/pages/Post";
import Settings from "../features/settings/pages/Settings";
import Dashboard from "../features/dashboard/pages/Dashboard";

function App() {
    return (
        <div>
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/artist-signup" element={<ArtistSignUp />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<SitePage page="categories" />} />
                    <Route path="/about" element={<SitePage page="about" />} />
                    <Route path="/contact" element={<SitePage page="contact" />} />
                    <Route path="/careers" element={<SitePage page="careers" />} />
                    <Route path="/privacy" element={<SitePage page="privacy" />} />
                    <Route path="/terms" element={<SitePage page="terms" />} />
                    <Route path="/refunds" element={<SitePage page="refunds" />} />
                    <Route path="/role" element={<SelectRole />} />
                    <Route path="/artists" element={<ArtistsList />} />
                    <Route path="/artists/:username" element={<Artists />} />
                    <Route path="/client" element={<Client />} />
                    <Route path="/client/:username" element={<Client />} />
                    <Route path="/posts/:_id" element={<Post />} />

                    <Route element={<AppLayout />}>
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/posts" element={<Feed />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/notifications" element={<NotificationPage />} />
                        <Route path="/messages" element={<Message />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/my-bookings" element={<Booking />} />
                        <Route path="/booking/:id" element={<BookingDetails />} />
                        <Route path="/booking-request" element={<BookingRequest />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
