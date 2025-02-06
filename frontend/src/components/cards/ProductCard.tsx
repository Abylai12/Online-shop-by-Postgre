"use client";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axios-instance";
import { Products } from "@/utils/types";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Products }) => {
  const { user } = useAuth();

  const addToWishlist = async (id: string) => {
    try {
      const res = await axiosInstance.post("/wishlist", { productId: id });
      switch (res.status) {
        case 200:
          toast.success("Product added to cart");
          break;
        case 400:
          toast.warning("Product already added to cart");
          break;
        default:
          toast.error("An unexpected error occurred");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please login to add products to cart");
      return;
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.images[0]}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>
        <button onClick={() => handleSave()}>
          <Heart
            size={22}
            strokeWidth={1}
            className="absolute top-4 right-4 hover:fill-inherit"
          />
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
