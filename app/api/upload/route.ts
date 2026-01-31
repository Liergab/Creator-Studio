import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

const UPLOAD_DIR = "public/uploads";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
// Instagram Content Publishing API accepts JPEG only for single-image posts
const ALLOWED_TYPES = ["image/jpeg"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Use form field 'file'." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Instagram requires JPEG only. Please upload a .jpg image." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // If Cloudinary is configured, upload there so Instagram gets a public URL
    if (isCloudinaryConfigured()) {
      const { secure_url } = await uploadImageBuffer(
        buffer,
        file.type,
        "neurobank-uploads"
      );
      return NextResponse.json({ url: secure_url });
    }

    // Fallback: save to local public/uploads
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;
    const uploadDir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, baseName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${baseName}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
