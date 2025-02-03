"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader } from "lucide-react";
import { InputProduct, InputSize } from "@/utils/types";
import ImageInput from "./ImageInput";
import ProductForm from "./ProductForm";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "react-toastify";
import { handleImageUpload } from "@/utils/handle-upload-image";
import SizeInputForm from "./SizeInputForm";

type CreateProductProp = {
  setRefetch: Dispatch<SetStateAction<boolean>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

const CreateProductForm = ({ setRefetch, setActiveTab }: CreateProductProp) => {
  const [loading, setLoading] = useState(false);
  const [isMultiSize, setMultiSize] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [newProduct, setNewProduct] = useState<InputProduct>({
    name: "",
    description: "",
    barcode: "",
    stock_quantity: 0,
    price: 0,
    category_id: "",
    isFeatured: false,
  });
  const [newSizes, setNewSizes] = useState<InputSize[]>([
    {
      size: "",
      stock_quantity: 0,
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    try {
      if (files.length < 0) {
        toast.error("Must be upload image");
        return;
      }
      const urls = await handleImageUpload(files);
      const res = await axiosInstance.post("/products", {
        newProduct,
        urls,
        newSizes,
      });
      if (res.status === 200) {
        toast.success("Product created successfully");
      }
      setRefetch((prev: boolean) => !prev);
      setActiveTab("products");
      setNewProduct({
        name: "",
        description: "",
        barcode: "",
        stock_quantity: 0,
        price: 0,
        category_id: "",
        isFeatured: false,
      });
      setFiles([]);
      setImagePreviews([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-6 justify-between">
          <ProductForm newProduct={newProduct} setNewProduct={setNewProduct} />
          <div className="flex-1">
            <label
              htmlFor="description"
              className=" text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              rows={12}
              className=" w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        <div className="mb-2 flex items-center space-x-4">
          <input
            type="checkbox"
            id="terms"
            checked={isMultiSize}
            onChange={(e) => setMultiSize(e.target.checked)}
            className="appearance-none w-4 h-4 border-4 border-gray-600 rounded-full bg-gray-700 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 ease-in-out"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium text-gray-300 cursor-pointer hover:text-emerald-300 transition duration-200"
          >
            Multi sizes?
          </label>
        </div>

        {isMultiSize && (
          <div>
            <SizeInputForm newSizes={newSizes} setNewSizes={setNewSizes} />
          </div>
        )}

        <div className="mt-1">
          <ImageInput
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            setFiles={setFiles}
            files={files}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
