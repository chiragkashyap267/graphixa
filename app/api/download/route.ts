import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import cloudinary from "cloudinary";

// Cloudinary config (server-only)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // 1️⃣ Check order exists & paid
  const orderRef = doc(db, "orders", orderId);
  const snap = await getDoc(orderRef);

  if (!snap.exists() || !snap.data().paid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 2️⃣ Generate signed download URL (expires in 60s)
  const signedUrl = cloudinary.v2.utils.private_download_url(
    "products/insta-mockup-pack", // ⬅️ your Cloudinary public_id (ZIP)
    "zip",
    { expires_at: Math.floor(Date.now() / 1000) + 60 }
  );

  // 3️⃣ Redirect to signed URL
  return NextResponse.redirect(signedUrl);
}
