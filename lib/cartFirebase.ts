import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";

/* SAVE CART TO FIREBASE */
export const saveCartToFirebase = async (userId: string, cart: any[]) => {
  const batch = writeBatch(db);
  const cartRef = collection(db, "users", userId, "cart");

  // clear old cart
  const snap = await getDocs(cartRef);
  snap.docs.forEach((d) => batch.delete(d.ref));

  // add updated cart
  cart.forEach((item) => {
    const docRef = doc(cartRef, item.id);
    batch.set(docRef, item);
  });

  await batch.commit();
};

/* LOAD CART FROM FIREBASE */
export const loadCartFromFirebase = async (userId: string) => {
  const snap = await getDocs(collection(db, "users", userId, "cart"));
  return snap.docs.map((d) => d.data());
};
