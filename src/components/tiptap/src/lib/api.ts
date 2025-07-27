import axios from "axios";
export class API {
  public static uploadImage = async (_file: File): Promise<string> => {
    if (!_file) throw new Error("No file provided");

    const formData = new FormData();
    formData.append("file", _file);
    formData.append("upload_preset", "madar_folder"); // 🔁 your preset
    const cloudName = "dlxgadgxa"; // 🔁 your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      return response.data.secure_url as string;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  };

  public static uploadVideo = async (_file: File) => {
    console.log(_file);
    console.log(
      "Image upload is disabled in the demo... Please implement the API.uploadImage method in your project."
    );
    await new Promise((r) => setTimeout(r, 2500));
    return "/video.mp4";
  };
}

export default API;
