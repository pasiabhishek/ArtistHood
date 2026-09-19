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
import Notification from "./components/notification/Notification";
import Message from "./pages/Message";
import Booking from "./pages/Booking";
import Artists from "./pages/Artists";
import ArtistsList from "./pages/ArtistsList";
import BookingRequest from "./pages/BookingRequest";
import Client from "./pages/Client";
import Post from "./pages/Post";

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
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<SitePage page="categories" />} />
                    <Route path="/role" element={<SelectRole />} />
                    <Route path="/artists" element={<ArtistsList />} />
                    <Route path="/artists/:username" element={<Artists />} />
                    <Route path="/client" element={<Client />} />
                    <Route path="/client/:username" element={<Client />} />
                    <Route path="/posts" element={<Feed />} />
                    <Route path="/posts/:_id" element={<Post />} />
                    <Route path="/booking-request" element={<BookingRequest />} />

                    <Route element={<AppLayout />}>
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/notifications" element={<Notification />} />
                        <Route path="/messages" element={<Message />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/create-post" element={<CreatePost />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
