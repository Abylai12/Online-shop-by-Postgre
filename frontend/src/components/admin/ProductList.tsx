"use client";
import axiosInstance from "@/utils/axios-instance";
import { Products } from "@/utils/types";
import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type ProductListProp = {
  setRefetch: Dispatch<SetStateAction<boolean>>;
  products: Products[];
};

const ProductsList = ({ products, setRefetch }: ProductListProp) => {
  const [loading, setLoading] = useState(false);

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/products/${productId}`);
      if (res.status === 200) {
        toast.success("Product deleted successfully");
      }
      setRefetch((pre) => !pre);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to delete product");
    }
  };
  const toggleFeaturedProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(`/products/${productId}`);
      if (res.status === 200) {
        toast.success("Product updated successfully", {
          autoClose: 1000,
        });
      }
      setRefetch((pre) => !pre);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update product");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className=" min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product.id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.images[0]}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">${product.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {product.category_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  disabled={loading}
                  onClick={() => toggleFeaturedProduct(product.id)}
                  className={`p-1 rounded-full ${
                    product.isfeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  disabled={loading}
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
export default ProductsList;
