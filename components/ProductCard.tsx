"use client";


import Link from "next/link";
import WatermarkedImage from "./WatermarkedImage";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
        <WatermarkedImage publicId={product.previewId} />
        <div className="p-4">
          <h2 className="font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-600">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
