import { saveOrder } from "@/lib/orders";
import { generateInvoicePDF } from "@/lib/invoice";

export const openRazorpay = ({
  userId,
  cart,
  totalAmount,
}: {
  userId: string;
  cart: any[];
  totalAmount: number;
}) => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: totalAmount * 100, // paise
    currency: "INR",
    name: "GraphiXA",
    description: "Cart Checkout",

    handler: async function (response: any) {
      try {
        // 1️⃣ Save order to Firebase
        await saveOrder({
          userId,
          cart,
          totalAmount,
          paymentId: response.razorpay_payment_id,
        });

        // 2️⃣ Generate Invoice PDF
        await generateInvoicePDF({
          orderId: response.razorpay_payment_id,
          items: cart,
          totalAmount,
          userId,
        });

        // 3️⃣ Notify UI about successful purchase
        window.dispatchEvent(
        
          new CustomEvent("purchase-success", {
            detail: {
              orderId: response.razorpay_payment_id,
            },
          })
        );
      } catch (err) {
        console.error("Order / Invoice error:", err);

        window.dispatchEvent(
          new CustomEvent("purchase-partial-success")
        );
      }
    },

    theme: {
      color: "#14b8a6",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
