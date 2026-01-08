"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types/product";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.push("/");
        return;
      }

      setProduct({
        id: snap.id,
        ...(snap.data() as Omit<Product, "id">),
      });

      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300">
        Loading product…
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
            <Image
              src={product.previewUrl}
              alt={product.title}
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {product.title}
              </h1>

              <p className="text-slate-300 mb-6 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>

              <p className="text-3xl font-bold text-teal-400 mb-8">
                ₹{product.price}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  addToCart(product);
                  router.push("/cart");
                }}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  flex: 1,
                  backgroundColor: "#020617",
                  color: "#2dd4bf",
                  border: "1px solid rgba(45,212,191,0.6)",
                  fontWeight: 600,
                  paddingY: 1.5,
                  borderRadius: "0.75rem",
                  "&:hover": {
                    backgroundColor: "rgba(45,212,191,0.1)",
                  },
                }}
              >
                Add to Cart
              </Button>

              <Button
                onClick={() => {
                  addToCart(product);
                  router.push("/checkout");
                }}
                startIcon={<FlashOnIcon />}
                sx={{
                  flex: 1,
                  backgroundColor: "#2dd4bf",
                  color: "#020617",
                  fontWeight: 700,
                  paddingY: 1.5,
                  borderRadius: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#5eead4",
                  },
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
