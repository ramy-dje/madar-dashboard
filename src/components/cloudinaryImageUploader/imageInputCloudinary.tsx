// components/ImageUploader.tsx
import { useState, useRef } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";

export default function ImageUploader({
  onChange,
}: {
  onChange: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadToCloudinary(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "madar_folder"); // your preset
    const cloudName = "dlxgadgxa"; // your cloud name

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImageUrl(data.secure_url);
      onChange(data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };
  const resetImage = () => {
    setImageUrl("");
    onChange("");
  };
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto p-4">
      <div
        onClick={() => !imageUrl && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative w-full h-60 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 overflow-hidden group"
      >
        {/* Image Preview */}
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetImage();
              }}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : uploading ? (
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud className="w-6 h-6 mb-1" />
            <p className="text-sm">Click or drag & drop to upload</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
      </div>
    </div>
  );
}
