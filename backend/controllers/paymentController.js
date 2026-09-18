
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import razorpay from "../config/razorpay.js";


// CREATE RAZORPAY ORDER
export const createPaymentOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Booking ID required
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }

        // Find booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Only booking client can pay
        if (
            booking.client.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Only the client can make this payment",
            });
        }

        // Payment only after artist accepts
        if (booking.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Payment is available only for accepted bookings",
            });
        }



        // Check existing payment
        const existingPayment = await Payment.findOne({
            booking: booking._id,
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment order already exists for this booking",
                orderId: existingPayment.razorpayOrderId,
            });
        }

        // Booking price comes from database
        const amount = booking.price * 100;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `booking_${booking._id}`,
        });

        // Save payment
        const payment = await Payment.create({
            booking: booking._id,
            client: req.user.id,
            amount: booking.price,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.status(201).json({
            success: true,
            message: "Payment order created successfully",

            payment: {
                id: payment._id,
                bookingId: booking._id,
                amount: booking.price,
                currency: "INR",
                razorpayOrderId: order.id,
            },

            razorpayKey: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error(
            "Create payment order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create payment order",
        });
    }
};