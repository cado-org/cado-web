import { v2 as cloudinary } from "cloudinary";
import { ENV, isCloudinaryConfigured } from "../env";

function ensureCloudinaryConfig() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

ensureCloudinaryConfig();

export { cloudinary };

export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = "cado-ecommerce",
  mimeType: string = "image/jpeg"
): Promise<{ url: string; public_id: string } | null> {
  ensureCloudinaryConfig();
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary is not configured. Upload aborted.");
    return null;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        timeout: 60000,
      },
      (err, res) => {
        if (err || !res) {
          console.error("Cloudinary upload_stream failed, attempting base64 fallback:", err?.message);
          const base64Uri = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
          cloudinary.uploader
            .upload(base64Uri, { folder, resource_type: "auto", timeout: 60000 })
            .then((r) => resolve({ url: r.secure_url, public_id: r.public_id }))
            .catch((fallbackErr) => reject(fallbackErr || err));
        } else {
          resolve({
            url: res.secure_url,
            public_id: res.public_id,
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return false;
  }
}
