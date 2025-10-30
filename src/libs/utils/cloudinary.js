import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 30000,
});

export async function uploadImage(buffer, originalFilename = "") {
  return new Promise((resolve, reject) => {
    // Create a readable stream from buffer
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    // Generate a safe public ID
    const publicId = originalFilename
      ? `menu-${Date.now()}-${originalFilename
          .replace(/\.[^/.]+$/, "")
          .replace(/[^\w-]/g, "-")}`
      : `menu-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "menu-items",
        public_id: publicId,
        overwrite: false,
        resource_type: "auto",
        timeout: 30000,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Failed to upload image: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    // Handle stream errors
    readableStream.on("error", (error) => {
      console.error("Stream error:", error);
      reject(new Error("Failed to process image stream"));
    });

    // Pipe the stream to Cloudinary
    readableStream.pipe(uploadStream);
  });
}
