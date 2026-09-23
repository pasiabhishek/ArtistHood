import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import { getSessionUser } from "../services/api";
import { addMessage, getThread, getThreads, upsertThread } from "../services/demoStore";
import useRequireAuth from "../hooks/useRequireAuth";

export default function Message() {
    useRequireAuth();
    const currentUser = getSessionUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedUser = searchParams.get("user") || "";

    const [threads, setThreads] = useState(getThreads());
    const [activeUser, setActiveUser] = useState(requestedUser.toLowerCase());
    const [draft, setDraft] = useState("");

    useEffect(() => {
        if (!requestedUser) return;
        const username = requestedUser.toLowerCase();
        if (!getThread(username)) {
            upsertThread({
                withUsername: username,
                withName: requestedUser,
                messages: [
                    {
                        from: "system",
                        text: `Start a conversation with @${username} about your booking.`,
                        at: new Date().toISOString(),
                    },
                ],
            });
        }
        setThreads(getThreads());
        setActiveUser(username);
    }, [requestedUser]);

    const activeThread = useMemo(
        () => threads.find((thread) => thread.withUsername === activeUser) || threads[0],
        [threads, activeUser]
    );

    const sendMessage = (event) => {
        event.preventDefault();
        if (!draft.trim() || !activeThread) return;
        const username = activeThread.withUsername;
        addMessage(username, {
            from: currentUser?.username || "me",
            text: draft.trim(),
            at: new Date().toISOString(),
        });
        setThreads(getThreads());
        setDraft("");
        setSearchParams({ user: username });
    };

    return (
        <div className="discover-page">
            <header className="discover-header">
                <div>
                    <p className="discover-kicker">Inbox</p>
                    <h1>Messages</h1>
                </div>
                <Link to="/artists" className="primary-discover-btn">
                    Find someone to message
                </Link>
            </header>

            {threads.length === 0 ? (
                <section className="page-empty">
                    <h2>No conversations yet</h2>
                    <p>
                        Open an artist profile and use Message, or send a booking request to start a thread.
                    </p>
                    <Link to="/artists">Browse artists</Link>
                </section>
            ) : (
                <div className="inbox-layout">
                    <aside className="inbox-pane inbox-list">
                        {threads.map((thread) => (
                            <button
                                type="button"
                                key={thread.withUsername}
                                className={`thread-row ${thread.withUsername === activeThread?.withUsername ? "is-active" : ""}`}
                                onClick={() => {
                                    setActiveUser(thread.withUsername);
                                    setSearchParams({ user: thread.withUsername });
                                }}
                            >
                                <strong>{thread.withName || thread.withUsername}</strong>
                                <span>
                                    {thread.messages?.[thread.messages.length - 1]?.text || "No messages yet"}
                                </span>
                            </button>
                        ))}
                    </aside>
                    <section className="inbox-pane inbox-thread">
                        <p className="inbox-meta">@{activeThread?.withUsername}</p>
                        <h2>{activeThread?.withName || activeThread?.withUsername}</h2>
                        <div className="chat-log">
                            {(activeThread?.messages || []).map((message, index) => (
                                <div
                                    key={`${message.at}-${index}`}
                                    className={`chat-bubble ${
                                        message.from === currentUser?.username ? "mine" : ""
                                    }`}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <form className="inbox-compose" onSubmit={sendMessage}>
                            <input
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                placeholder="Write a message"
                                aria-label="Message"
                            />
                            <button type="submit" className="booking-approve-button">
                                Send
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
