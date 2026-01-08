export const runtime = "nodejs";

import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { adminDb } from "@/lib/firebaseAdmin";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    console.log("🟢 ADD PRODUCT API HIT");

    const formData = await req.formData();

    const category = formData.get("category") as string;
    const subCategory = formData.get("subCategory") as string | null;
    const tagsRaw = formData.get("tags") as string | null;

    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : [];

    const description = formData.get("description") as string;

    const title = formData.get("title");
    const price = formData.get("price");
    const preview = formData.get("preview");
    const file = formData.get("file");

    if (!title || !price || !preview || !file) {
      throw new Error("Missing form fields");
    }

    // 🔹 PREVIEW IMAGE
    const previewBuffer = Buffer.from(await (preview as File).arrayBuffer());

    const previewUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "products/previews" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(previewBuffer);
    });

    // 🔹 ZIP FILE (PRESERVE NAME)
    const zipFile = file as File;
    const zipBaseName = zipFile.name.replace(/\.zip$/i, "");
    const fileBuffer = Buffer.from(await zipFile.arrayBuffer());

    const fileUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          folder: "products/files",
          resource_type: "raw",
          type: "private",

          public_id: zipBaseName,
          format: "zip",
          use_filename: true,
          unique_filename: false,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    // 🔹 SAVE PRODUCT
    await adminDb.collection("products").add({
      title,
      description,
      price: Number(price),
      previewUrl: previewUpload.secure_url,
      filePublicId: fileUpload.public_id,

      category,
      subCategory: subCategory || null,
      tags,

      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ ADD PRODUCT FAILED:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
