import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const { userId, cartItems, paymentId, amount } = await req.json();

  const orderRef = await adminDb.collection("orders").add({
    userId,
    productIds: cartItems.map((p: any) => p.id),
    paymentId,
    amount,
    status: "paid",
    createdAt: Date.now(),
  });

  const batch = adminDb.batch();

  cartItems.forEach((item: any) => {
    const purchaseRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("purchases")
      .doc(item.id);

    batch.set(purchaseRef, {
      productId: item.id,
      orderId: orderRef.id,
      purchasedAt: Date.now(),
    });
  });

  await batch.commit();

  return Response.json({ success: true });
}
