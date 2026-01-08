import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing slider id" },
        { status: 400 }
      );
    }

    // ✅ ADMIN SDK — bypasses Firestore rules
    const ref = adminDb.collection("sliders").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ success: true });
    }

    const data = snap.data();

    // ✅ DELETE FROM FIRESTORE (THIS FIXES REAPPEARING ISSUE)
    await ref.delete();

    // ⚠️ Best-effort Cloudinary cleanup (never blocks)
    if (data?.imageUrl) {
      try {
        const file = data.imageUrl.split("/").pop();
        const publicId = file?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`sliders/${publicId}`);
        }
      } catch (err) {
        console.warn("Cloudinary cleanup failed:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/sliders/delete failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
