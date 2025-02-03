"use client";

import { Upload } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef } from "react";

type InputImage = {
  files: File[];
  imagePreviews: string[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  setImagePreviews: Dispatch<SetStateAction<string[]>>;
};

const ImageInput = ({ setFiles, files , imagePreviews, setImagePreviews}: InputImage) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const fileArray = Array.from(fileList);
      setFiles((prevProduct) => [...prevProduct, ...fileArray]);
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevImages) => [...prevImages, ...previewUrls]);
    }
  };

  const handleDelete = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };
  const handleButtonClick = () => {
    fileInputRef.current!.click();
  };

  return (
    <div className="p-4 ">
      <div className="flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="block mb-4"
          style={{ display: "none" }}
          multiple
        />
        <button type="button" onClick={handleButtonClick}>
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {imagePreviews.map((previewUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={previewUrl}
              alt={`Preview ${index}`}
              className="w-24 h-24 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageInput;
