import { v2 as cloudinary } from "cloudinary";
import { ENV, isCloudinaryConfigured } from "../env";

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = "cado-ecommerce"
): Promise<{ url: string; public_id: string } | null> {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary is not configured. Upload aborted.");
    return null;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Failed to upload image to Cloudinary"));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
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
