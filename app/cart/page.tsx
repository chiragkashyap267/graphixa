"use client";

import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import { openRazorpay } from "@/lib/razorpay";
import EmptyState from "@/components/ui/EmptyState";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const user = useAuth();
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    const onSuccess = () => {
      clearCart();
      setPurchaseSuccess(true);
    };

    window.addEventListener("purchase-success", onSuccess);

    return () => {
      window.removeEventListener("purchase-success", onSuccess);
    };
  }, [clearCart]);

  const totalAmount = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  if (!user) {
    return (
      <EmptyState
        title="You're not logged in"
        description="Sign in to view your cart and manage your purchases."
        actionLabel="Login"
        actionHref="/login"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCartIcon className="text-teal-400" />
          <h1 className="text-3xl font-bold">My Cart</h1>
        </div>

        {cart.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse premium assets and add them to your cart."
            actionLabel="Explore assets"
            actionHref="/"
          />
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-5"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <Button
                    variant="outlined"
                    onClick={() => removeFromCart(item.id)}
                    sx={{
                      borderColor: "#ef4444",
                      color: "#ef4444",
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-teal-300">
                  ₹{totalAmount}
                </span>
              </div>

              <Button
                fullWidth
                variant="outlined"
                disabled={totalAmount <= 0}
                onClick={() =>
                  openRazorpay({
                    userId: user.uid,
                    cart,
                    totalAmount,
                  })
                }
                sx={{
                  borderColor: "#2dd4bf",
                  color: "#2dd4bf",
                  fontWeight: 600,
                }}
              >
                Pay ₹{totalAmount}
              </Button>
            </div>
          </>
        )}
      </div>

      {purchaseSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#020617] border border-teal-400/40 rounded-2xl p-6 text-center w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-3">
              Purchase Successful 🎉
            </h2>

            <p className="text-white/70 mb-6">
              Your asset is now available in{" "}
              <span className="text-teal-300">My Account</span>.
            </p>

            <button
              onClick={() => {
                setPurchaseSuccess(false);
                router.push("/account");
              }}
              className="px-6 py-3 rounded-xl bg-teal-400 text-black font-semibold"
            >
              Go to My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
