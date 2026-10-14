
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "../styles/pages/Discover.css";
import "../styles/pages/Workspace.css";
import {
    fetchConversations,
    openConversation,
    fetchMessages,
    sendChatMessage,
    markChatAsRead,
    getSessionUser,
} from "../services/api";
import useRequireAuth from "../hooks/useRequireAuth";

function userId(user) {
    return String(user?._id || user?.id || "");
}

function otherParticipant(conversation, currentUser) {
    return conversation?.participants?.find(
        (person) => userId(person) !== userId(currentUser)
    );
}

function messageText(message) {
    return message?.text || "";
}

function lastMessageText(conversation) {
    return conversation?.lastMessage?.text || "No messages yet";
}

export default function Message() {
    useRequireAuth();

    const currentUser = getSessionUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedUsername = (
        searchParams.get("user") || ""
    ).trim().toLowerCase();

    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const activeConversation = useMemo(
        () => conversations.find(
            (conversation) => String(conversation._id) === activeId
        ) || null,
        [conversations, activeId]
    );

    const activeUser = otherParticipant(activeConversation, currentUser);

    const loadConversations = useCallback(async () => {
        const data = await fetchConversations();
        setConversations(data);
        return data;
    }, []);

    const loadMessages = useCallback(async (conversation) => {
        if (!conversation?._id) {
            setMessages([]);
            return;
        }

        const conversationId = String(conversation._id);

        const history = await fetchMessages(conversationId);
        setMessages(history);

        await markChatAsRead(conversationId);

        setConversations((current) =>
            current.map((item) =>
                String(item._id) === conversationId
                    ? { ...item, unreadCount: 0 }
                    : item
            )
        );
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function initializeInbox() {
            setLoading(true);
            setError("");
            setNotice("");

            try {
                const data = await fetchConversations();
                if (cancelled) return;

                setConversations(data);

                if (requestedUsername) {
                    const existing = data.find((conversation) =>
                        otherParticipant(conversation, currentUser)
                            ?.username?.toLowerCase() === requestedUsername
                    );

                    let target = existing;

                    if (!target) {
                        target = await openConversation(requestedUsername);
                    }

                    if (cancelled) return;

                    setConversations((previous) => {
                        const withoutTarget = previous.filter(
                            (item) => String(item._id) !== String(target._id)
                        );
                        return [target, ...withoutTarget];
                    });

                    setActiveId(String(target._id));
                } else if (data.length > 0) {
                    setActiveId(String(data[0]._id));
                }
            } catch (requestError) {
                if (!cancelled) {
                    console.error("Load inbox error:", requestError);
                    setError(
                        requestError.response?.data?.message ||
                        requestError.message ||
                        "Unable to load messages."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        initializeInbox();

        return () => {
            cancelled = true;
        };
    }, [requestedUsername, currentUser?._id, currentUser?.id]);

    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            return;
        }

        let cancelled = false;

        async function loadActiveConversation() {
            setError("");

            try {
                const history = await fetchMessages(activeConversation._id);
                if (cancelled) return;

                setMessages(history);

                await markChatAsRead(activeConversation._id);
                if (cancelled) return;

                setConversations((previous) =>
                    previous.map((conversation) =>
                        String(conversation._id) === String(activeConversation._id)
                            ? { ...conversation, unreadCount: 0 }
                            : conversation
                    )
                );
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError.response?.data?.message ||
                        "Unable to load conversation history."
                    );
                }
            }
        }

        loadActiveConversation();

        return () => {
            cancelled = true;
        };
    }, [activeId]); // Load history when the selected conversation changes.

    const selectConversation = (conversation) => {
        setActiveId(String(conversation._id));
        setNotice("");
        setError("");

        const username = otherParticipant(conversation, currentUser)?.username;
        if (username) {
            setSearchParams({ user: username });
        }
    };

    const handleSend = async (event) => {
        event.preventDefault();

        const text = draft.trim();
        if (!text || !activeConversation || sending) return;

        setSending(true);
        setError("");
        setNotice("");

        try {
            const savedMessage = await sendChatMessage(
                activeConversation._id,
                text
            );

            setMessages((previous) => [...previous, savedMessage]);
            setDraft("");

            // Refresh inbox previews and sort by latest message.
            const updatedConversations = await loadConversations();

            setConversations((previous) => {
                const found = updatedConversations.find(
                    (item) =>
                        String(item._id) === String(activeConversation._id)
                );

                if (!found) return previous;
                return [
                    found,
                    ...updatedConversations.filter(
                        (item) => String(item._id) !== String(found._id)
                    ),
                ];
            });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Message could not be sent. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="discover-page">
                <p>Loading your inbox...</p>
            </div>
        );
    }

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

            {error && (
                <p className="workspace-banner error" role="alert">
                    {error}
                </p>
            )}

            {notice && <p className="workspace-banner">{notice}</p>}

            {conversations.length === 0 && !activeConversation ? (
                <section className="page-empty">
                    <h2>No conversations yet</h2>
                    <p>
                        Visit an artist profile and select Message to start
                        a conversation.
                    </p>
                    <Link to="/artists">Browse artists</Link>
                </section>
            ) : (
                <div className="inbox-layout">
                    <aside className="inbox-pane inbox-list">
                        <h2>Inbox</h2>

                        {conversations.map((conversation) => {
                            const person = otherParticipant(
                                conversation,
                                currentUser
                            );

                            return (
                                <button
                                    type="button"
                                    key={conversation._id}
                                    className={`thread-row ${String(conversation._id) === activeId
                                            ? "is-active"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        selectConversation(conversation)
                                    }
                                >
                                    <strong>
                                        {person?.fullName ||
                                            person?.username ||
                                            "User"}
                                    </strong>

                                    <span>
                                        {lastMessageText(conversation)}
                                    </span>

                                    {conversation.unreadCount > 0 && (
                                        <span>
                                            {conversation.unreadCount} unread
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </aside>

                    <section className="inbox-pane inbox-thread">
                        {!activeConversation ? (
                            <div className="page-empty">
                                <h2>Select a conversation</h2>
                                <p>Choose someone from your inbox.</p>
                            </div>
                        ) : (
                            <>
                                <p className="inbox-meta">
                                    @{activeUser?.username || "user"}
                                </p>

                                <h2>
                                    {activeUser?.fullName ||
                                        activeUser?.username ||
                                        "Conversation"}
                                </h2>

                                <div className="chat-log" aria-live="polite">
                                    {messages.length === 0 ? (
                                        <p>No messages yet. Say hello!</p>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`chat-bubble ${userId(message.sender) ===
                                                        userId(currentUser)
                                                        ? "mine"
                                                        : ""
                                                    }`}
                                            >
                                                {messageText(message)}
                                                <small>
                                                    {message.createdAt
                                                        ? new Date(
                                                            message.createdAt
                                                        ).toLocaleString()
                                                        : ""}
                                                </small>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form
                                    className="inbox-compose"
                                    onSubmit={handleSend}
                                >
                                    <input
                                        value={draft}
                                        onChange={(event) =>
                                            setDraft(event.target.value)
                                        }
                                        placeholder="Write a message"
                                        aria-label="Message"
                                        maxLength={5000}
                                        disabled={sending}
                                    />

                                    <button
                                        type="submit"
                                        className="booking-approve-button"
                                        disabled={sending || !draft.trim()}
                                    >
                                        {sending ? "Sending..." : "Send"}
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
