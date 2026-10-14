const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { User } = require("../models/User");

const participantFields = "username fullName profileImage role";

const isValidId = (id) => mongoose.isValidObjectId(id);

const getParticipantConversation = async (conversationId, userId) => {
    if (!isValidId(conversationId)) return null;

    return Conversation.findOne({
        _id: conversationId,
        participants: userId,
    });
};

// POST /api/messages/conversations
const createConversation = async (req, res) => {
    try {
        const username = String(req.body.username || "")
            .trim()
            .toLowerCase();

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Recipient username is required",
            });
        }

        const recipient = await User.findOne({ username }).select(
            "_id username fullName profileImage role"
        );

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (recipient._id.equals(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot message yourself",
            });
        }

        const ids = [
            req.user._id.toString(),
            recipient._id.toString(),
        ].sort();

        const participantKey = ids.join(":");

        let conversation = await Conversation.findOne({ participantKey });

        if (!conversation) {
            try {
                conversation = await Conversation.create({
                    participants: ids,
                    participantKey,
                });
            } catch (error) {
                // Handle two simultaneous requests creating the same conversation.
                if (error.code !== 11000) throw error;
                conversation = await Conversation.findOne({ participantKey });
            }
        }

        conversation = await Conversation.findById(conversation._id)
            .populate("participants", participantFields)
            .populate({
                path: "lastMessage",
                populate: { path: "sender", select: participantFields },
            });

        return res.status(200).json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error("Create conversation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to open conversation",
        });
    }
};

// GET /api/messages/conversations
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
        })
            .populate("participants", participantFields)
            .populate({
                path: "lastMessage",
                populate: { path: "sender", select: participantFields },
            })
            .sort({ lastMessageAt: -1, updatedAt: -1 });

        const result = await Promise.all(
            conversations.map(async (conversation) => {
                const unreadCount = await Message.countDocuments({
                    conversation: conversation._id,
                    recipient: req.user._id,
                    readAt: null,
                });

                return {
                    ...conversation.toObject(),
                    unreadCount,
                };
            })
        );

        return res.status(200).json({
            success: true,
            conversations: result,
        });
    } catch (error) {
        console.error("Get conversations error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load conversations",
        });
    }
};

// GET /api/messages/conversations/:id
const getMessages = async (req, res) => {
    try {
        const conversation = await getParticipantConversation(
            req.params.id,
            req.user._id
        );

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const limit = Math.min(
            Math.max(Number.parseInt(req.query.limit, 10) || 50, 1),
            100
        );

        const messages = await Message.find({
            conversation: conversation._id,
        })
            .populate("sender", participantFields)
            .populate("recipient", participantFields)
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            messages: messages.reverse(),
        });
    } catch (error) {
        console.error("Get messages error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load messages",
        });
    }
};

// POST /api/messages/conversations/:id
const sendMessage = async (req, res) => {
    try {
        const text = String(req.body.text || "").trim();

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 5000 characters",
            });
        }

        const conversation = await getParticipantConversation(
            req.params.id,
            req.user._id
        );

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const recipientId = conversation.participants.find(
            (id) => !id.equals(req.user._id)
        );

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: "Conversation recipient not found",
            });
        }

        let message = await Message.create({
            conversation: conversation._id,
            sender: req.user._id,
            recipient: recipientId,
            text,
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        message = await Message.findById(message._id)
            .populate("sender", participantFields)
            .populate("recipient", participantFields);

        return res.status(201).json({
            success: true,
            message,
        });
    } catch (error) {
        console.error("Send message error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};

// PATCH /api/messages/conversations/:id/read
const markConversationRead = async (req, res) => {
    try {
        const conversation = await getParticipantConversation(
            req.params.id,
            req.user._id
        );

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const result = await Message.updateMany(
            {
                conversation: conversation._id,
                recipient: req.user._id,
                readAt: null,
            },
            { $set: { readAt: new Date() } }
        );

        return res.status(200).json({
            success: true,
            updatedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Mark messages read error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark messages as read",
        });
    }
};

module.exports = {
    createConversation,
    getConversations,
    getMessages,
    sendMessage,
    markConversationRead,
};
