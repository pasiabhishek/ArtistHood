
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaPaperPlane,
    FaRegCommentDots,
    FaSearch,
} from "react-icons/fa";

import "../../discover/styles/Discover.css";
import "../styles/Message.css";
import {
    fetchConversations,
    openConversation,
    fetchMessages,
    sendChatMessage,
    markChatAsRead,
    getSessionUser,
} from "../../../shared/services/api";
import useRequireAuth from "../../../shared/hooks/useRequireAuth";

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

function displayName(person) {
    return person?.fullName || person?.username || "User";
}

function profileImage(person) {
    return person?.profileImage || person?.avatar || person?.profilePicture || "";
}

function initials(person) {
    return displayName(person)
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function formatMessageTime(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const sameDay = date.toDateString() === new Date().toDateString();
    return sameDay
        ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : date.toLocaleDateString([], { month: "short", day: "numeric" });
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
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileListOpen, setMobileListOpen] = useState(false);

    const activeConversation = useMemo(
        () => conversations.find(
            (conversation) => String(conversation._id) === activeId
        ) || null,
        [conversations, activeId]
    );

    const activeUser = otherParticipant(activeConversation, currentUser);
    const filteredConversations = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return conversations;

        return conversations.filter((conversation) => {
            const person = otherParticipant(conversation, currentUser);
            return `${displayName(person)} ${person?.username || ""} ${lastMessageText(conversation)}`
                .toLowerCase()
                .includes(query);
        });
    }, [conversations, currentUser, searchTerm]);

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
        setMobileListOpen(false);
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
        <div className="discover-page message-page">
            <header className="discover-header message-page-header">
                <div>
                    <p className="discover-kicker">Stay connected</p>
                    <h1>Messages</h1>
                    <p className="message-page-subtitle">
                        Your conversations with the ArtistHood community.
                    </p>
                </div>
                <Link to="/artists" className="primary-discover-btn">
                    Find someone to message
                </Link>
            </header>

            {error && (
                <p className="message-banner error" role="alert">
                    {error}
                </p>
            )}

            {notice && <p className="message-banner">{notice}</p>}

            {conversations.length === 0 && !activeConversation ? (
                <section className="message-empty-state">
                    <span className="message-empty-icon" aria-hidden="true">
                        <FaRegCommentDots />
                    </span>
                    <p className="message-section-label">Your inbox is ready</p>
                    <h2>No conversations yet</h2>
                    <p>
                        Find an artist you love and start a conversation about
                        their work.
                    </p>
                    <Link to="/artists" className="primary-discover-btn">
                        Browse artists
                    </Link>
                </section>
            ) : (
                <div
                    className={`inbox-layout message-inbox-layout ${
                        mobileListOpen ? "mobile-list-open" : ""
                    }`}
                >
                    <aside className="inbox-pane inbox-list">
                        <div className="message-list-heading">
                            <div>
                                <p className="message-section-label">Your space</p>
                                <h2>Inbox</h2>
                            </div>
                            <span className="message-conversation-count">
                                {conversations.length}
                            </span>
                        </div>
                        <label className="message-search">
                            <FaSearch aria-hidden="true" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search conversations"
                                aria-label="Search conversations"
                            />
                        </label>

                        <div className="message-thread-list">
                        {filteredConversations.map((conversation) => {
                            const person = otherParticipant(
                                conversation,
                                currentUser
                            );
                            const isActive =
                                String(conversation._id) === activeId;
                            const unreadCount = Number(conversation.unreadCount) || 0;

                            return (
                                <button
                                    type="button"
                                    key={conversation._id}
                                    className={`thread-row message-thread-row ${
                                        isActive ? "is-active" : ""
                                    }`}
                                    aria-current={isActive ? "true" : undefined}
                                    onClick={() =>
                                        selectConversation(conversation)
                                    }
                                >
                                    <span className="message-avatar" aria-hidden="true">
                                        {profileImage(person) ? (
                                            <img src={profileImage(person)} alt="" />
                                        ) : (
                                            initials(person)
                                        )}
                                    </span>
                                    <span className="message-thread-copy">
                                        <span className="message-thread-topline">
                                            <strong>{displayName(person)}</strong>
                                            <time>
                                                {formatMessageTime(
                                                        conversation.lastMessage?.createdAt
                                                )}
                                            </time>
                                        </span>
                                        <span className="message-thread-preview">
                                            {lastMessageText(conversation)}
                                        </span>
                                    </span>
                                    {unreadCount > 0 && (
                                        <span
                                            className="message-unread-badge"
                                            aria-label={`${unreadCount} unread ${
                                                unreadCount === 1 ? "message" : "messages"
                                            }`}
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                        {filteredConversations.length === 0 && (
                            <p className="message-search-empty">
                                No conversations match “{searchTerm.trim()}”.
                            </p>
                        )}
                        </div>
                    </aside>

                    <section className="inbox-pane inbox-thread">
                        {!activeConversation ? (
                            <div className="message-thread-placeholder">
                                <FaRegCommentDots aria-hidden="true" />
                                <h2>Select a conversation</h2>
                                <p>Choose a conversation to pick up where you left off.</p>
                            </div>
                        ) : (
                            <>
                                <header className="message-conversation-header">
                                    <button
                                        type="button"
                                        className="message-back-button"
                                        onClick={() => setMobileListOpen(true)}
                                        aria-label="Back to conversations"
                                    >
                                        <FaArrowLeft aria-hidden="true" />
                                    </button>
                                    <span className="message-avatar message-header-avatar" aria-hidden="true">
                                        {profileImage(activeUser) ? (
                                            <img
                                                src={profileImage(activeUser)}
                                                alt=""
                                            />
                                        ) : (
                                            initials(activeUser)
                                        )}
                                    </span>
                                    <div className="message-conversation-identity">
                                        <h2>{displayName(activeUser)}</h2>
                                        <p>
                                            {activeUser?.username
                                                ? `@${activeUser.username}`
                                                : "ArtistHood member"}
                                        </p>
                                    </div>
                                </header>

                                <div
                                    className="chat-log message-chat-log"
                                    aria-label={`Conversation with ${displayName(activeUser)}`}
                                    aria-live="polite"
                                >
                                    {messages.length === 0 ? (
                                        <div className="message-chat-empty">
                                            <span className="message-avatar message-empty-avatar" aria-hidden="true">
                                                {profileImage(activeUser) ? (
                                                        <img src={profileImage(activeUser)} alt="" />
                                                ) : (
                                                        initials(activeUser)
                                                )}
                                            </span>
                                            <h3>Start the conversation</h3>
                                            <p>Send a friendly hello to {displayName(activeUser)}.</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`chat-bubble message-chat-bubble ${
                                                    userId(message.sender) === userId(currentUser)
                                                        ? "mine"
                                                        : ""
                                                }`}
                                            >
                                                {messageText(message)}
                                                {formatMessageTime(message.createdAt) && (
                                                    <time>
                                                        {formatMessageTime(message.createdAt)}
                                                    </time>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form
                                    className="inbox-compose message-compose"
                                    onSubmit={handleSend}
                                >
                                    <input
                                        value={draft}
                                        onChange={(event) =>
                                            setDraft(event.target.value)
                                        }
                                        placeholder="Write a message..."
                                        aria-label="Message"
                                        maxLength={5000}
                                        disabled={sending}
                                    />

                                    <button
                                        type="submit"
                                        className="message-send-button"
                                        disabled={sending || !draft.trim()}
                                        aria-label={sending ? "Sending message" : "Send message"}
                                    >
                                        <FaPaperPlane aria-hidden="true" />
                                        <span>{sending ? "Sending..." : "Send"}</span>
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
