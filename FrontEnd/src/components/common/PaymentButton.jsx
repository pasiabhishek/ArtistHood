import axios from "axios";
import { authHeaders, getApiUrl } from "../../services/api";

export default function PaymentButton({ booking, onPaid }) {
    const handlePayment = async () => {
        try {
            const response = await axios.post(
                getApiUrl("api/payments/create-order"),
                { bookingId: booking._id },
                { headers: authHeaders() }
            );

            const payment = response.data.payment;

            const options = {
                key: response.data.razorpayKey,
                amount: payment.amount * 100,
                currency: "INR",
                name: "ArtistHood",
                description: "Artist Booking Payment",
                order_id: payment.razorpayOrderId,
                handler: async function (razorpayResponse) {
                    try {
                        const result = await axios.post(
                            getApiUrl("api/payments/verify"),
                            {
                                razorpay_order_id: razorpayResponse.razorpay_order_id,
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_signature: razorpayResponse.razorpay_signature,
                            },
                            { headers: authHeaders() }
                        );

                        if (result.data.success) {
                            if (onPaid) {
                                onPaid(result.data.booking);
                            } else {
                                window.location.reload();
                            }
                        }
                    } catch (error) {
                        console.error(error.response?.data || error);
                        alert("Payment verification failed");
                    }
                },
            };

            if (!window.Razorpay) {
                alert("Payment is not available right now. Refresh the page and try again.");
                return;
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error(error.response?.data || error);
            alert(error.response?.data?.message || "Payment failed to start");
        }
    };

    return (
        <button type="button" onClick={handlePayment} className="booking-approve-button">
            Pay ₹{Number(booking.price || 0).toLocaleString("en-IN")}
        </button>
    );
}
