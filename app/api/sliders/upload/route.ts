import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const order = Number(formData.get("order"));

    if (!file) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "sliders" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // ✅ Save to Firestore using ADMIN SDK
    await adminDb.collection("sliders").add({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id, // 🔥 important for clean deletes later
      title,
      subtitle,
      order,
      active: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Upload slider failed:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
