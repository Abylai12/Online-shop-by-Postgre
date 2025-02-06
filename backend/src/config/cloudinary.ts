import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection successful:", result);
  } catch (error) {
    console.error("Error connecting to Cloudinary:", error);
  }
};

testCloudinaryConnection();
