"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import {
  saveCartToFirebase,
  loadCartFromFirebase,
} from "@/lib/cartFirebase";

/* ================= TYPES ================= */

export type CartItem = {
  id: string;
  title: string;
  price: number;
  previewUrl: string;
  category?: string;
  quantity: number;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // ✅ added
} | null>(null);


/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const user = useAuth();

  /* 🔹 LOAD CART FROM FIREBASE ON LOGIN / REFRESH */
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const loadCart = async () => {
      const savedCart = await loadCartFromFirebase(user.uid);

      setCart(
        savedCart.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          previewUrl: item.previewUrl,
          category: item.category,
          quantity: item.quantity ?? 1,
        }))
      );
    };

    loadCart();
  }, [user]);

  /* 🔹 SAVE CART TO FIREBASE ON CHANGE */
  useEffect(() => {
    if (!user) return;
    saveCartToFirebase(user.uid, cart);
  }, [cart, user]);

  /* 🔹 ADD TO CART */
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    if (!product?.id) {
      console.error("Invalid product passed to cart:", product);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* 🔹 REMOVE FROM CART */
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /* 🔹 CLEAR CART (AFTER PURCHASE) */
const clearCart = () => {
  setCart([]);
};


  return (
    <CartContext.Provider
  value={{
    cart,
    addToCart,
    removeFromCart,
    clearCart, // ✅ exposed
  }}
>

      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
