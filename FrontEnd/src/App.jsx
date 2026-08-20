import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Loader from "./pages/Loader";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import SitePage from "./pages/SitePage";
import Feed from "./pages/Feed";

function App() {
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/artist" element={<SitePage page="artists" />} />
                    <Route path="/categories" element={<SitePage page="categories" />} />

                    <Route element={<AppLayout />}>
                    <Route path="/feed" element={<Feed />} />

                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
