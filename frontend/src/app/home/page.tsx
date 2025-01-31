"use client";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryItem from "@/components/items/CategoryItem";
import { apiURL } from "@/utils/apiURL";
import { Products } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";

const categories = [
  {
    href: "/jeans",
    name: "Jeans",
    imageUrl:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGplYW5zfGVufDB8fDB8fHww",
  },
  {
    href: "/t-shirts",
    name: "T-shirts",
    imageUrl:
      "https://images.unsplash.com/photo-1613852348851-df1739db8201?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dCUyMHNoaXJ0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    href: "/shoes",
    name: "Shoes",
    imageUrl:
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    href: "/glasses",
    name: "Glasses",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1733989074425-1a3402a64ef1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    href: "/jackets",
    name: "Jackets",
    imageUrl:
      "https://images.unsplash.com/photo-1577660002965-04865592fc60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amFja2V0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    href: "/suits",
    name: "Suits",
    imageUrl:
      "https://images.unsplash.com/photo-1582897291228-f7676bfcd52c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1aXRzfGVufDB8fDB8fHww",
  },
  {
    href: "/bags",
    name: "Bags",
    imageUrl:
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJhZ3N8ZW58MHx8MHx8fDA%3D",
  },
];

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

  useEffect(() => {
    fetchFeaturedProducts();
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!loading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};
export default HomePage;
