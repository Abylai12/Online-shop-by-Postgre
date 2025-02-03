import axios from "axios";

export const handleImageUpload = async (files: File[]) => {
  try {
    const uploadPromises = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "E-commerce");
      return axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData
      );
    });
    const responses = await Promise.all(uploadPromises);
    const secureUrls = responses.map((response) => response.data.secure_url);
    return secureUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};
