import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { DetailProduct } from "@/utils/types";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const DetailCart = ({ product }: { product: DetailProduct | null }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const { setRefetch } = useCart();
  const { user } = useAuth();
  const addToCart = async (product_id: string) => {
    try {
      if (!user) {
        toast.warning("must be logged in");
        return;
      }
      await axiosInstance.post("/cart", {
        productId: product_id,
        quantity,
        size,
      });
      setRefetch((prev) => !prev);
      toast.success("Product added to cart");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSub = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSize = (sizeOption: string) => {
    if (size === sizeOption) {
      setSize(null);
      setStockQuantity(0);
      setQuantity(1);
    } else {
      setSize(sizeOption);
      const selectedSize = product?.product_sizes.find(
        (item) => item.size === sizeOption
      );
      if (selectedSize) {
        setStockQuantity(selectedSize.stock_quantity);
        setQuantity(1);
      }
    }
  };

  const productImages = product?.images ?? [];

  const nextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(productImages.length - 1);
    }
  };
  useEffect(() => {
    if (product?.total_stock_quantity !== 0 && product) {
      setStockQuantity(product?.total_stock_quantity);
    }
  }, [product]);
  return (
    <section className="text-white mt-10">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-row-reverse gap-5">
          <div className="relative">
            {productImages.length > 0 ? (
              <img
                src={productImages[currentImageIndex]}
                alt="img"
                className="w-[422px] h-[521px] rounded-2xl"
              />
            ) : (
              <p>No image available</p>
            )}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
            >
              {"<"}
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
            >
              {">"}
            </button>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {productImages.map((img: string, idx: number) => (
              <img
                src={img}
                alt="img"
                className="w-[67px] h-[67px] rounded-sm"
                key={idx}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-end">
          <div className="flex gap-4 items-center">
            <h2 className="font-bold text-2xl">{product?.name}</h2>
            <Heart size={22} strokeWidth={1} />
          </div>
          <p>{product?.description}</p>

          <div className="flex flex-col gap-2 my-4">
            <p className="text-base underline">Size options</p>
            <div className="flex gap-2">
              {product?.total_stock_quantity === 0 ? (
                product?.product_sizes.map((item, idx) => (
                  <Button
                    className={`${
                      size === item.size
                        ? "bg-green-500 text-white"
                        : "bg-transparent text-white border-white"
                    } rounded-full border w-8 h-8 flex items-center justify-center`}
                    key={idx}
                    onClick={() => handleSize(item.size)}
                  >
                    {item.size}
                  </Button>
                ))
              ) : (
                <p> no size option</p>
              )}
            </div>

            <div className="mt-4 flex items-center">
              <Button
                className="rounded-full bg-transparent border border-white text-white w-8 h-8"
                onClick={handleSub}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <label className="mx-4">{quantity}</label>
              <Button
                className="rounded-full bg-transparent border border-white text-white w-8 h-8"
                onClick={() => {
                  if (quantity < stockQuantity) {
                    setQuantity(quantity + 1);
                  }
                }}
                disabled={quantity >= stockQuantity}
              >
                +
              </Button>
            </div>

            <p className="text-sm text-white mt-2">
              {`Available stock:  ${stockQuantity}`}
            </p>
          </div>

          <div className="mt-6 mb-14">
            {product?.total_stock_quantity === 0 ? (
              <Button
                className="bg-[#2563EB]"
                onClick={() => addToCart(product!.id)}
                disabled={quantity <= 0 || !size}
              >
                Add to cart
              </Button>
            ) : (
              <Button
                className="bg-[#2563EB]"
                onClick={() => addToCart(product!.id)}
                disabled={quantity <= 0}
              >
                Add to cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailCart;
