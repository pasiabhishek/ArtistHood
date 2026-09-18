const express = require("express");
const { createPaymentOrder } = require("../controllers/paymentController.js");

const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post(
    "/create-order",
    protect,
    createPaymentOrder
);

module.exports = router;