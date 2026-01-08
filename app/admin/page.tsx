"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Button from "@mui/material/Button";
import SliderManager from "@/components/admin/SliderManager";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  previewUrl: string;
};

export default function AdminPage() {
  const router = useRouter();

  // 🔐 ADMIN SESSION CHECK (UNCHANGED)
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  if (
    typeof window !== "undefined" &&
    sessionStorage.getItem("isAdmin") !== "true"
  ) {
    return null;
  }

  // 📦 PRODUCTS
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchProducts = async () => {
    setLoadingList(true);
    const snap = await getDocs(collection(db, "products"));
    setProducts(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }))
    );
    setLoadingList(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ ADD PRODUCT FORM (UNCHANGED LOGIC)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // ➕ CATEGORY & TAG STATES (NEW)
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const submitProduct = async () => {
    if (!title || !description || !price || !preview || !file) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("preview", preview);
    formData.append("file", file);
    formData.append("category", category);
    formData.append("subCategory", subCategory); // optional
    formData.append("tags", tags.join(",")); // optional

    setUploading(true);

    const res = await fetch("/api/admin/add-product", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      alert("Product added");
      setTitle("");
      setDescription("");
      setPrice("");
      setPreview(null);
      setFile(null);
      fetchProducts();
    } else {
      alert("Add failed");
    }
  };

  // 🗑 DELETE PRODUCT (UNCHANGED LOGIC)
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch("/api/admin/delete-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Product deleted");
      fetchProducts();
    } else {
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Admin Panel <span className="text-teal-400">/ Products</span>
      </h1>

      {/* ➕ ADD PRODUCT */}
      <div className="mb-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6 text-teal-300">
          Add New Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price (₹)"
            className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Description"
          className="mt-4 w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl bg-black text-white border border-white/20 mt-4"
          required
        >
          <option value="">Select Category</option>
          <option value="indian-textures">Indian Textures</option>
          <option value="indian-packaging">Indian Packaging Designs</option>
          <option value="indian-icons">Indian Icons & Symbols</option>
          <option value="indian-overlays">Indian Overlays</option>
        </select>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPreview(e.target.files?.[0] || null)}
          />

          <input
            type="file"
            accept=".zip,.rar"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            disabled={uploading}
            onClick={submitProduct}
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#020617",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#5eead4",
              },
            }}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </Button>
        </div>
      </div>

      <SliderManager />

      {/* 📦 PRODUCT LIST */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Existing Products</h2>

      {loadingList ? (
        <p className="text-slate-400">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products found.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-slate-400">₹{p.price}</p>
              </div>

              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteProduct(p.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
