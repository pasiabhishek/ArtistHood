const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    createConversation,
    getConversations,
    getMessages,
    sendMessage,
    markConversationRead,
} = require("../controllers/messageController");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id", getMessages);
router.post("/conversations/:id", sendMessage);
router.patch("/conversations/:id/read", markConversationRead);

module.exports = router;
