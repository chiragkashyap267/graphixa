import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export async function addToUserCart(userId: string, product: any) {
  await setDoc(doc(db, "users", userId, "cart", product.id), {
    productId: product.id,
    title: product.title,
    price: product.price,
    previewUrl: product.previewUrl,
    addedAt: Date.now(),
  });
}

export async function removeFromUserCart(userId: string, productId: string) {
  await deleteDoc(doc(db, "users", userId, "cart", productId));
}
