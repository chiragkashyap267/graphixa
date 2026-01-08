import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import cloudinary from "cloudinary";
import { adminDb } from "@/lib/firebaseAdmin";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    // 🔐 Verify token
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decoded = await getAuth().verifyIdToken(token);
    const userId = decoded.uid;

    // 🧾 Verify purchase
    const purchaseSnap = await adminDb
      .collection("users")
      .doc(userId)
      .collection("purchases")
      .doc(productId)
      .get();

    if (!purchaseSnap.exists) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 📦 Get product
    const productSnap = await adminDb
      .collection("products")
      .doc(productId)
      .get();

    if (!productSnap.exists) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { filePublicId } = productSnap.data()!;
    if (!filePublicId) {
      return new NextResponse("No downloadable file", { status: 404 });
    }

    // 🔑 Generate Cloudinary signed URL (15 min)
    const signedUrl = cloudinary.v2.utils.private_download_url(
      filePublicId,
      "",
      {
        resource_type: "raw",
        expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
      }
    );

    return NextResponse.redirect(signedUrl);
  } catch (err) {
    console.error("Download error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
