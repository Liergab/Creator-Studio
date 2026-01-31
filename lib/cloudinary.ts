import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured(): boolean {
  return !!(cloudName && apiKey && apiSecret);
}

/**
 * Upload image buffer to Cloudinary. Returns the public secure_url.
 * Call only when isCloudinaryConfigured() is true.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  mimeType: string = "image/jpeg",
  folder: string = "neurobank-uploads"
): Promise<{ secure_url: string; public_id: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const b64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}
