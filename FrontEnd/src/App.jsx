import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/auth/Signup";
import ArtistSignUp from "./pages/auth/ArtistSignUp";
import SitePage from "./pages/SitePage";
import Feed from "./components/post/Feed";
import SelectRole from "./pages/auth/SelectRole";
import CreatePost from "./components/post/CreatePost";
import Discover from "./pages/Discover";
import NotificationPage from "./pages/NotificationPage";
import Message from "./pages/Message";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import BookingRequest from "./pages/BookingRequest";
import Artists from "./pages/Artists";
import ArtistsList from "./pages/ArtistsList";
import Client from "./pages/Client";
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

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
