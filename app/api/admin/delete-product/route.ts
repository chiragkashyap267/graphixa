import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing productId" },
        { status: 400 }
      );
    }

    // 🔍 Get product
    const ref = adminDb.collection("products").doc(productId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const data = snap.data()!;

    // ☁ Delete preview image
    if (data.previewUrl) {
      const publicId = data.previewUrl
        .split("/")
        .slice(-2)
        .join("/")
        .replace(/\.[^/.]+$/, "");

      await cloudinary.uploader.destroy(publicId);
    }

    // ☁ Delete digital file
    if (data.filePath) {
      await cloudinary.uploader.destroy(data.filePath, {
        resource_type: "raw",
      });
    }

    // 🗑 Delete Firestore doc
    await ref.delete();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
