"use client";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryItem from "@/components/items/CategoryItem";
import { apiURL } from "@/utils/apiURL";
import { Category, Products } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiURL}/products/featured`);
      if (res.status === 200) {
        setProducts(res.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategories = async () => {
    try {
      const res = await axios.get(`${apiURL}/category/home`);
      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    getCategories();
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>
        {!loading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
