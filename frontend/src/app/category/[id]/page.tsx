"use client";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/utils/apiURL";
import { toast } from "react-toastify";
import { Products } from "@/utils/types";
import ProductCard from "@/components/cards/ProductCard";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<Products[]>([]);
  const fetchProductsByCategory = async () => {
    try {
      const res = await axios.get(`${apiURL}/products/category/${id}`);
      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          hello
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
export default CategoryPage;
