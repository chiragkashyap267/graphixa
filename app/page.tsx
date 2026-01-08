"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CategoryHeader from "@/components/ui/CategoryHeader";
import { useAuth } from "@/components/AuthContext";
import gsap from "gsap";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@/components/CartContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import SpotlightCard from "@/components/ui/SpotlightCard";

/* CATEGORY DISPLAY META */
const CATEGORY_META: Record<string, { title: string; subtitle: string }> = {
  "indian-textures": {
    title: "Indian Textures",
    subtitle: "Authentic Indian grains, papers & surface textures",
  },
  "indian-packaging": {
    title: "Indian Packaging Designs",
    subtitle: "Packaging layouts inspired by Indian brands",
  },
  "indian-icons": {
    title: "Indian Icons & Symbols",
    subtitle: "Cultural symbols & vector icon packs",
  },
  "indian-overlays": {
    title: "Indian Overlays",
    subtitle: "Festive dust, light & cultural overlays",
  },
};

export default function HomePage() {
  const { addToCart } = useCart();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<AlertColor>("success");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuth();

  /* FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      const list: Product[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));
      setProducts(list);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  /* GSAP ENTRY */
  useEffect(() => {
    if (products.length === 0) return;

    gsap.fromTo(
      ".product-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform",
      }
    );
  }, [products.length]);

  /* GROUP PRODUCTS BY CATEGORY */
  const groupedProducts = products.reduce<Record<string, Product[]>>(
    (acc, product) => {
      if (!product.category) return acc;
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Loading products…
      </div>
    );
  }

  return (
    <div className="bg-[#020617] text-white">
      <HomeHeroSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        {Object.entries(CATEGORY_META).map(([categoryId, meta]) => {
          const items = groupedProducts[categoryId];
          if (!items || items.length === 0) return null;

          return (
            <section key={categoryId} className="mb-20 sm:mb-32">
              <div className="mb-6 sm:mb-10">
                <CategoryHeader title={meta.title} subtitle={meta.subtitle} />
              </div>

              <SpotlightCard>
                {/* GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className="
                        product-card
                        rounded-2xl
                        bg-gradient-to-br from-white/10 via-white/5 to-transparent
                        backdrop-blur-xl
                        border border-white/10
                        transition
                        hover:border-teal-400/60
                      "
                    >
                      {/* IMAGE */}
                      <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-t-2xl">
                        <Image
                          src={product.previewUrl}
                          alt={product.title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="p-3 lg:p-4">
                        <h3 className="text-sm lg:text-base font-semibold mb-1 line-clamp-1">
                          {product.title}
                        </h3>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm lg:text-lg font-bold text-teal-300">
                            ₹{product.price}
                          </span>

                          <div className="flex gap-1 lg:gap-2">
                            <button
                              onClick={() =>
                                router.push(`/products/${product.id}`)
                              }
                              className="px-2 py-1
  lg:px-4 lg:py-2
  rounded-md lg:rounded-lg
  border border-teal-400/40
  text-teal-300
  text-xs lg:text-base"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                if (!user) {
                                  router.push("/login");
                                  return;
                                }
                                addToCart(product);
                                setToastMessage("Added to cart");
                                setToastType("success");
                                setToastOpen(true);
                              }}
                              className="px-2 py-1
  lg:px-4 lg:py-2
  rounded-md lg:rounded-lg
  bg-teal-400
  text-black
  text-xs lg:text-base
  font-semibold"
                            >
                              <ShoppingCartIcon fontSize="inherit" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </section>
          );
        })}
      </div>

      {/* TOAST */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          severity={toastType}
          sx={{
            backgroundColor: "#020617",
            color: "#2dd4bf",
            border: "1px solid rgba(45,212,191,0.4)",
          }}
          elevation={6}
          variant="filled"
        >
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
