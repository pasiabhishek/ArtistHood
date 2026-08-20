import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Loader from "./pages/Loader";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import ArtistSignUp from "./pages/ArtistSignUp";
import SitePage from "./pages/SitePage";
import Feed from "./pages/Feed";

function App() {
    // Keep the loader visible briefly while the first screen is prepared.
    const [loading, setLoading] = useState(true);
    const auth = localStorage.getItem('user')

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
                    <Route path="/artist" element={<SitePage page="artists" />} />
                    <Route path="/categories" element={<SitePage page="categories" />} />


                    {/* Feed pages share the signed-in navigation layout. */}
                    <Route Route element={auth?<AppLayout />:<Login/>}>
                        <Route path="/feed" element={<Feed />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;
