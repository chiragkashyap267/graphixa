import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveOrder({
  userId,
  cart,
  totalAmount,
  paymentId,
}: {
  userId: string;
  cart: any[];
  totalAmount: number;
  paymentId: string;
}) {
  // 1️⃣ Create global order
  const orderRef = await addDoc(collection(db, "orders"), {
    userId,
    items: cart.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount,
    paymentId,
    status: "paid",
    createdAt: serverTimestamp(),
  });

  // 2️⃣ CREATE PURCHASE RECORDS (THIS WAS MISSING)
  for (const item of cart) {
    await setDoc(
      doc(db, "users", userId, "purchases", item.id),
      {
        productId: item.id,
        orderId: orderRef.id,
        purchasedAt: serverTimestamp(),
      }
    );
  }

  return orderRef.id;
}
