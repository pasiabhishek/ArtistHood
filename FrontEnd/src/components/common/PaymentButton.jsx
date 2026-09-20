import axios from "axios";

export default function PaymentButton({ booking }) {

    const handlePayment = async () => {
        try {

            // Create Razorpay order
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payments/create-order`,
                {
                    bookingId: booking._id,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const payment = response.data.payment;

            const options = {
                key: response.data.razorpayKey,

                amount: payment.amount * 100,

                currency: "INR",

                name: "ArtistHood",

                description: "Artist Booking Payment",

                order_id: payment.razorpayOrderId,

                handler: function (response) {

                    console.log(
                        "Payment successful",
                        response
                    );

                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.log(
                error.response?.data || error
            );

            alert("Payment failed to start");
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="px-4 py-2 bg-black text-white rounded"
        >
            Pay ₹{booking.price}
        </button>
    );
}