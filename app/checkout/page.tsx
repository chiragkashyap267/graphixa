"use client";

import { useCart } from "@/components/CartContext";
import Script from "next/script";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";

export default function CheckoutPage() {
  const { cart } = useCart();
  const user = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // 👇 PAYMENT LOGIC (UNCHANGED)
  const handlePayment = async () => {
    if (typeof window === "undefined") return;

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      name: "Digital Store",
      description: "Digital Products Purchase",
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: cart[0].id,
            userId: user.uid,
          }),
        });

        const data = await verifyRes.json();

        if (data.success) {
          alert("Payment verified successfully!");
          window.location.href = `/download?orderId=${response.razorpay_order_id}`;
        } else {
          alert("Payment verification failed");
        }
      },
      theme: {
        color: "#000000",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300">
        No items to checkout
      </div>
    );
  }

  return (
    <>
      {/* Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#020617] text-white px-6 py-16">
        <div className="max-w-xl mx-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_25px_70px_-20px_rgba(45,212,191,0.4)]">
          <div className="flex items-center gap-3 mb-6">
            <PaymentIcon className="text-teal-400" />
            <h1 className="text-3xl font-bold">
              Checkout
            </h1>
          </div>

          {/* CART ITEMS */}
          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center rounded-lg bg-black/40 border border-white/10 px-4 py-3"
              >
                <span className="font-medium">
                  {item.title}
                </span>
                <span className="text-teal-400 font-semibold">
                  ₹{item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 mb-6 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-teal-400">
              ₹{total}
            </span>
          </div>

          {/* PAY BUTTON */}
          <Button
            fullWidth
            onClick={handlePayment}
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#020617",
              fontWeight: 600,
              paddingY: 1.4,
              borderRadius: "0.75rem",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#5eead4",
              },
            }}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </>
  );
}
