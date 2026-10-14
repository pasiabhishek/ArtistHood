import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import Header from "../components/home/Header";
import Footer from "../components/layout/Footer";
import Loader from "../components/common/Loader";
import PostCard from "../components/post/PostCard";
import { authHeaders, getApiUrl } from "../services/api";

export default function Post() {
    const { _id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(getApiUrl("api/posts"), {
                    headers: authHeaders(),
                });
                const posts = Array.isArray(response.data?.posts) ? response.data.posts : [];
                setPost(posts.find((item) => String(item._id) === String(_id)) || null);
            } catch {
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [_id]);

    if (loading) return <Loader />;

    if (!post) {
        return (
            <main>
                <Header />
                <section className="page-empty">
                    <h1>Post not found</h1>
                    <p>This post may have been removed or the feed is unavailable.</p>
                    <Link to="/discover">Back to discover</Link>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <main>
            <Header />
            <article className="discover-page">
                <PostCard post={post} linkToPost={false} />
            </article>
            <Footer />
        </main>
    );
}
