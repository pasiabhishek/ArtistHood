const express = require("express");
const { createPaymentOrder, verifyPayment } = require("../controllers/paymentController.js");

const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post(
    "/create-order",
    protect,
    createPaymentOrder
);

router.post(
    "/verify",
    protect,
    verifyPayment
);

module.exports = router;