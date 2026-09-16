import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Loader from "./components/common/Loader";
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

function App() {
    // Keep the loader visible briefly while the first screen is prepared.
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loader />;

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {/* Public authentication pages do not use the dashboard shell. */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/artist-signup" element={<ArtistSignUp />} />
                    {/* Unknown URLs are handled by the branded 404 page. */}
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/artist" element={<SitePage page="artists" />} /> */}
                    <Route path="/categories" element={<SitePage page="categories" />} />
                    <Route path="/role" element={<SelectRole/>}/>
                    <Route path="/artists" element={<ArtistsList />}/>
                    <Route path="/artists/:username" element={<Artists />}/>
                    <Route path="/booking-request" element={<BookingRequest />}/>

                    {/* Feed pages share the signed-in navigation layout. */}
                    {/* Signed-in pages share the left and right navigation shell. */}
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
        </div >
    );
}

export default App;
